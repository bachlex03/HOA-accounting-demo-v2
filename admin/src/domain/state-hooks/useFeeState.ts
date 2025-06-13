import { z } from 'zod'
import * as anchor from '@coral-xyz/anchor'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import useProgram from '@/hooks/useProgram'
import type { TAddFeeChargePayload } from '../schemas/fee.schema'

let initialized = false

// Define Zod schemas
const FeeTypeSchema = z.enum(['monthly', 'special', 'unknown'])
const FeeStatusSchema = z.enum(['paid', 'unpaid', 'overdue', 'unknown'])

export type TFeeType = 'monthly' | 'special' | 'unknown'
export type TFeeStatus = 'paid' | 'unpaid' | 'overdue' | 'unknown'

export type TFeeChargeAccount = {
   publicKey: PublicKey
   data: {
      feeId: number
      feeType: TFeeType
      feeAmount: number
      feeStatus: TFeeStatus
      fromAdmin: PublicKey
      toRenter: PublicKey
      dueDate: number
      createdAt: number
      updatedAt: number
   }
}

const useFeeState = () => {
   const [fees, setFees] = useState<TFeeChargeAccount[]>([])
   const { program, connection, publicKey } = useProgram()

   const [isFetching, setIsFetching] = useState(false)
   const [isTransactionPending, setIsTransactionPending] = useState(false)
   //  console.log('initializeFees', initializeFees)

   const unpaidFees = useMemo(() => {
      return fees.filter((fee) => fee.data.feeStatus === 'unpaid')
   }, [fees])

   const overDueFees = useMemo(() => {
      return fees.filter((fee) => fee.data.feeStatus === 'overdue')
   }, [fees])

   const fetchFees = useCallback(async () => {
      if (!connection || !program || !publicKey) return

      try {
         setIsFetching(true)

         const fees = await program.account.feeChargeAccount.all([])

         const mappedFees = fees.map((fee) => {
            const feeTypeKey = Object.keys(fee.account.feeType)[0]
            const feeStatusKey = Object.keys(fee.account.status)[0]

            // Validate and fallback to "unknown" if invalid
            const feeType = FeeTypeSchema.safeParse(feeTypeKey).success
               ? FeeTypeSchema.parse(feeTypeKey)
               : ('unknown' as TFeeType)

            const feeStatus = FeeStatusSchema.safeParse(feeStatusKey).success
               ? FeeStatusSchema.parse(feeStatusKey)
               : ('unknown' as TFeeStatus)

            return {
               publicKey: fee.publicKey,
               data: {
                  feeId: fee.account.feeId.toNumber(),
                  feeType: feeType,
                  feeAmount: fee.account.amount.toNumber(),
                  feeStatus: feeStatus,
                  fromAdmin: fee.account.fromAdmin,
                  toRenter: fee.account.toRenter,
                  dueDate: fee.account.dueDate.toNumber(),
                  createdAt: fee.account.createdAt.toNumber(),
                  updatedAt: fee.account.updatedAt.toNumber(),
               },
            }
         })

         // Sort fees by createdAt in descending order (newest first)
         const sortedFees = mappedFees.sort(
            (a, b) => b.data.createdAt - a.data.createdAt,
         )

         setFees(sortedFees)
      } catch (err) {
         console.error('Error fetching:', err)
      } finally {
         setTimeout(() => {
            setIsFetching(false)
         }, 500)
      }
   }, [connection, isTransactionPending])

   const addFeeCharge = async (payload: TAddFeeChargePayload) => {
      if (program && publicKey) {
         try {
            setIsFetching(true)
            setIsTransactionPending(true)

            const timeStamp = payload.due_date.getTime() / 1000
            console.log('timeStamp', timeStamp)
            const amount = new anchor.BN(payload.amount)
            console.log('amount', amount)
            const dueDate = new anchor.BN(timeStamp) // Convert to seconds since epoch
            console.log('dueDate', dueDate)
            const nextFeeId = new anchor.BN(payload.next_fee_id) // Assuming this is the first fee being added
            console.log('nextFeeId', nextFeeId)

            const renterAccountSeeds = [
               Buffer.from('RENTER_STATE'),
               payload.public_key.toBuffer(),
            ]

            const [renterAccountPDA] = PublicKey.findProgramAddressSync(
               renterAccountSeeds,
               program.programId,
            )

            const feeChargeSeeds = [
               Buffer.from('FEE_CHARGE_STATE'),
               publicKey.toBuffer(),
               renterAccountPDA.toBuffer(),
               nextFeeId.toArrayLike(Buffer, 'le', 8),
            ]
            const [feeChargeAccountPDA] =
               anchor.web3.PublicKey.findProgramAddressSync(
                  feeChargeSeeds,
                  program.programId,
               )
            console.log(
               '[LOG:VAR]::feeChargeAccountPDA: ',
               feeChargeAccountPDA.toBase58(),
            )

            const params = {
               feeChargeAccount: feeChargeAccountPDA,
               toRenterAccount: renterAccountPDA,
               fromAuthority: publicKey,
            }

            const tx = await program.methods
               .addFeeCharge(payload.fee_type, amount, dueDate)
               .accounts(params)
               .rpc()

            console.log('[LOG:VAR]:tx::', tx)

            const feeChargeAccount =
               await program.account.feeChargeAccount.fetch(feeChargeAccountPDA)
            console.log(
               '[LOG:VAR]::feeChargeAccount.feeType: ',
               feeChargeAccount.feeType,
            )
            console.log(
               '[LOG:VAR]::feeChargeAccount.amount: ',
               feeChargeAccount.amount.toNumber(),
            )
            console.log(
               '[LOG:VAR]::feeChargeAccount.dueDate: ',
               feeChargeAccount.dueDate.toNumber(),
            )

            await fetchFees()
         } catch (err) {
            console.error('Error adding fee charge:', err)
         } finally {
            setTimeout(() => {
               setIsFetching(false)
            }, 500)
            setIsTransactionPending(false)
         }
      }
   }

   // Initial fetch and on connection change
   useEffect(() => {
      if (connection && !initialized) {
         fetchFees()
         initialized = true
      }
   }, [connection, initialized])

   return {
      fees,
      unpaidFees,
      overDueFees,
      setFees,
      isTransactionPending,
      setIsTransactionPending,
      isFetching,
      setIsFetching,
      addFeeCharge,
   }
}

export default useFeeState
