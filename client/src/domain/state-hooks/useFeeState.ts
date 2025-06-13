import { z } from 'zod'

import { useCallback, useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import useProgram from '@/hooks/useProgram'
import { useAuth } from '@/hooks/useAuth'

// Define Zod schemas
const FeeTypeSchema = z.enum(['monthly', 'special', 'unknown'])
const FeeStatusSchema = z.enum(['paid', 'unpaid', 'overdue', 'unknown'])

type TFeeType = 'monthly' | 'special' | 'unknown'
type TFeeStatus = 'paid' | 'unpaid' | 'overdue' | 'unknown'

type TFeeChargeAccount = {
   publicKey: PublicKey
   data: {
      feeId: number
      feeType: TFeeType
      feeAmount: number
      feeStatus: TFeeStatus
      fromAdmin: PublicKey
      toRenter: PublicKey
      createdAt: number
      updatedAt: number
   }
}

const useFeeState = () => {
   const [fees, setFees] = useState<TFeeChargeAccount[]>([])
   const [isTransactionPending, setIsTransactionPending] = useState(false)
   const { program, connection, publicKey } = useProgram()
   const [isFetching, setIsFetching] = useState(false)
   const { renterAccount } = useAuth()

   const fetchFees = useCallback(async () => {
      if (!connection || !program || !publicKey || !renterAccount) return

      try {
         setIsFetching(true)

         const fees = await program.account.feeChargeAccount.all([
            {
               memcmp: {
                  offset: 8 + 32, // Skip the discriminator + admin
                  bytes: publicKey.toBase58(), // Use the PDA of the renter account
               },
            },
         ])

         console.log('[2] Fees:', fees)

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
         console.error('Error fetching counter value:', err)
      } finally {
         setTimeout(() => {
            setIsFetching(false)
         }, 500)
      }
   }, [connection, renterAccount, isTransactionPending])

   // Initial fetch and on connection change
   useEffect(() => {
      if (connection) {
         fetchFees()
      }
   }, [connection, fetchFees, isTransactionPending])

   return {
      fees,
      setFees,
      isTransactionPending,
      setIsTransactionPending,
      isFetching,
      setIsFetching,
   }
}

export default useFeeState
