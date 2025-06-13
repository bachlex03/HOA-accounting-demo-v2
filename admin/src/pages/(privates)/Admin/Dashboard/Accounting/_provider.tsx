import type { TAddFeeChargePayload } from '@/domain/schemas/fee.schema'
import useProgram from '@/hooks/useProgram'
import { PublicKey } from '@solana/web3.js'
import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
} from 'react'
import z from 'zod'
import * as anchor from '@coral-xyz/anchor'

const FeeTypeSchema = z.enum(['monthly', 'special', 'unknown'])
const FeeStatusSchema = z.enum(['paid', 'unpaid', 'overdue', 'unknown'])

export type TRenterAccount = {
   publicKey: PublicKey
   data: {
      owner: PublicKey
      renterName: string
      nextFeeId: number
      createdAt: number
      updatedAt: number
   }
}

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

type AccountingContext = {
   renterAccount: {
      renters: TRenterAccount[]
      isFetching: boolean
      refetch?: () => void
   }
   feeChargeAccount: {
      fees: TFeeChargeAccount[]
      unpaidFees: TFeeChargeAccount[]
      overDueFees: TFeeChargeAccount[]
      isFetching: boolean
      refetch?: () => void
      addFeeChargeAsync: (payload: TAddFeeChargePayload) => Promise<void>
   }
}

const AccountingContext = createContext<AccountingContext | null>(null)

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const { program, connection, publicKey } = useProgram()

   const [renterAccount, setRenterAccount] = useState<{
      renters: TRenterAccount[]
      isFetching: boolean
   }>({
      renters: [],
      isFetching: false,
   })

   const [feeChargeAccount, setFeeChargeAccount] = useState<{
      fees: TFeeChargeAccount[]
      unpaidFees: TFeeChargeAccount[]
      overDueFees: TFeeChargeAccount[]
      isFetching: boolean
   }>({
      fees: [],
      unpaidFees: [],
      overDueFees: [],
      isFetching: false,
   })

   //  RenterAccount
   const fetchRentersAsync = useCallback(async () => {
      if (!connection || !program || !publicKey) return

      try {
         setRenterAccount((prev) => ({ ...prev, isFetching: true }))

         const renters = await program.account.renterAccount.all([])

         const mappedRenters: TRenterAccount[] = renters.map((renter) => {
            return {
               publicKey: renter.publicKey,
               data: {
                  owner: renter.account.owner,
                  renterName: renter.account.renterName,
                  nextFeeId: renter.account.nextFeeId.toNumber(),
                  createdAt: renter.account.createdAt.toNumber(),
                  updatedAt: renter.account.updatedAt.toNumber(),
               },
            }
         })

         setRenterAccount((prev) => ({ ...prev, renters: mappedRenters }))
      } catch (err) {
         console.error('Error fetching:', err)
      } finally {
         setTimeout(() => {
            setRenterAccount((prev) => ({ ...prev, isFetching: false }))
         }, 500)
      }
   }, [connection])

   useEffect(() => {
      if (connection) {
         fetchRentersAsync()
      }
   }, [connection])

   //  FeeChargeAccount
   const fetchFeesAsync = useCallback(async () => {
      if (!connection || !program || !publicKey) return

      console.log('[LOG:FUNC]:fetchFeesAsync')

      try {
         setFeeChargeAccount((prev) => ({
            ...prev,
            isFetching: true,
         }))

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

         console.log(
            'sortedFees.data.toRenter',
            sortedFees.map((fee) => fee.data.toRenter.toBase58()),
         )

         setFeeChargeAccount((prev) => ({
            ...prev,
            fees: sortedFees,
         }))
      } catch (err) {
         console.error('Error fetching:', err)
      } finally {
         setTimeout(() => {
            setFeeChargeAccount((prev) => ({
               ...prev,
               isFetching: false,
            }))
         }, 500)
      }
   }, [connection])

   const addFeeChargeAsync = async (payload: TAddFeeChargePayload) => {
      if (program && publicKey) {
         try {
            setFeeChargeAccount((prev) => ({ ...prev, isFetching: true }))

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
            const [feeChargeAccountPDA] = PublicKey.findProgramAddressSync(
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

            await fetchFeesAsync()
         } catch (err) {
            console.error('Error adding fee charge:', err)
         } finally {
            setTimeout(() => {
               setFeeChargeAccount((prev) => ({ ...prev, isFetching: false }))
            }, 500)
         }
      }
   }

   useEffect(() => {
      if (connection) {
         fetchFeesAsync()
      }
   }, [connection])

   const unpaidFees = useMemo(() => {
      return feeChargeAccount.fees.filter(
         (fee) => fee.data.feeStatus === 'unpaid',
      )
   }, [feeChargeAccount.fees])
   const overDueFees = useMemo(() => {
      return feeChargeAccount.fees.filter(
         (fee) => fee.data.feeStatus === 'overdue',
      )
   }, [feeChargeAccount.fees])

   const value = useMemo(
      () => ({
         renterAccount: {
            renters: renterAccount.renters,
            isFetching: renterAccount.isFetching,
         },
         feeChargeAccount: {
            fees: feeChargeAccount.fees,
            unpaidFees: unpaidFees,
            overDueFees: overDueFees,
            isFetching: feeChargeAccount.isFetching,
            addFeeChargeAsync: addFeeChargeAsync,
         },
      }),
      [renterAccount, feeChargeAccount],
   )
   return (
      <AccountingContext.Provider value={value}>
         {children}
      </AccountingContext.Provider>
   )
}

export const useAccountingPage = () => {
   const context = useContext(AccountingContext)
   if (!context) {
      throw new Error('useAccounting must be used within an AccountingProvider')
   }
   return context
}
