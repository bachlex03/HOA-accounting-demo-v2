/* eslint-disable react-refresh/only-export-components */
import useProgram from '@/hooks/useProgram'
import { PublicKey } from '@solana/web3.js'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

type RenterAccount = {
   pdaPubkey: PublicKey
   data: {
      owner: PublicKey
      renterName: string
      nextFeeId: number
      createAt: number
      updateAt: number
   }
}

type AuthContextType = {
   renterAccount: RenterAccount | null
   isFetching: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const { program, connection, publicKey } = useProgram()
   const [renterAccount, setRenterAccount] = useState<RenterAccount | null>(
      null,
   )
   const [isFetching, setIsFetching] = useState(false)

   console.log('Auth Provider')

   const fetchRenterAccount = useCallback(async () => {
      if (!connection || !program || !publicKey) return

      try {
         setIsFetching(true)

         //  const renterAccountSeeds = [
         //     Buffer.from('RENTER_STATE'),
         //     publicKey.toBuffer(),
         //  ]

         //  const [renterAccountPDA] = PublicKey.findProgramAddressSync(
         //     renterAccountSeeds,
         //     program.programId,
         //  )

         // //  const renterAccountData =
         // //     await program.account.renterAccount.fetch(renterAccountPDA)

         // //  setRenterAccount({
         // //     pdaPubkey: renterAccountPDA,
         // //     data: {
         // //        owner: renterAccountData.owner,
         // //        renterName: renterAccountData.renterName,
         // //        nextFeeId: Number(renterAccountData.nextFeeId),
         // //        createAt: (renterAccountData.createdAt as number) * 1000,
         // //        updateAt: (renterAccountData.updatedAt as number) * 1000,
         // //     },
         // //  })

         setRenterAccount(null)
      } catch (err) {
         console.error('Error fetching counter value:', err)
      } finally {
         setTimeout(() => {
            setIsFetching(false)
         }, 500)
      }
   }, [connection])

   // Initial fetch and on connection change
   useEffect(() => {
      if (connection) {
         fetchRenterAccount()
      }
   }, [connection, fetchRenterAccount])

   // Memoize the context value to avoid unnecessary re-renders
   const value = useMemo(
      () => ({ renterAccount, isFetching }),
      [renterAccount, isFetching],
   )

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
