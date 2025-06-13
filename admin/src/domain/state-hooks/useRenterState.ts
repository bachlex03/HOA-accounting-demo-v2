import useProgram from '@/hooks/useProgram'
import { useCallback, useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'

let initialized = false

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

const useRenterState = () => {
   const [renters, setRenters] = useState<TRenterAccount[]>([])
   const { program, connection, publicKey } = useProgram()
   const [isFetching, setIsFetching] = useState(false)
   const [isTransactionPending, setIsTransactionPending] = useState(false)

   const fetchRenters = useCallback(async () => {
      if (!connection || !program || !publicKey) return

      try {
         setIsFetching(true)

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

         setRenters(mappedRenters)
      } catch (err) {
         console.error('Error fetching:', err)
      } finally {
         setTimeout(() => {
            setIsFetching(false)
         }, 500)
      }
   }, [])

   // Initial fetch and on connection change
   useEffect(() => {
      if (connection) {
         fetchRenters()
      }
   }, [])

   return {
      renters,
      isTransactionPending,
      isFetching,
      setIsTransactionPending,
   }
}

export default useRenterState
