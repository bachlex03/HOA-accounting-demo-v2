/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from '@solana/wallet-adapter-react'
import useSolanaProgram from './use-solana-program'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import type { TAddRenterPayload } from '@/domain/schemas/renter.schema'

const useRenter = () => {
   const { program } = useSolanaProgram()
   const { publicKey } = useWallet()
   const [isLoading, setIsLoading] = useState(false)
   const [renters, setRenters] = useState<any[]>([])

   const initializeRenter = async (payload: TAddRenterPayload) => {
      {
         if (program && publicKey) {
            // try {
            //    setIsLoading(true);
            //    const renterSeeds = [
            //       Buffer.from('RENTER_STATE'),
            //       publicKey.toBuffer(),
            //    ];
            //    const [renterPda] = PublicKey.findProgramAddressSync(
            //       renterSeeds,
            //       program.programId,
            //    );
            //    const params = {
            //       renter: renterPda,
            //       owner: payload.public_key,
            //       authority: publicKey,
            //    };
            //    await program.methods
            //       .initializeRenter(payload.renter_name)
            //       .accounts({
            //          ...params,
            //       })
            //       .rpc();
            // } catch (error) {
            //    console.error('[LOG:ERROR]::', error);
            // } finally {
            //    setIsLoading(false);
            // }
         }
      }
   }

   useEffect(() => {
      const fetchRenters = async () => {
         try {
            if (program && publicKey) {
               const renterData = await program.account.renterAccount.all([])

               setRenters(renterData)
            }
         } catch (error) {
            console.error('[LOG:ERROR]::', error)
         }
      }

      fetchRenters()
   }, [])

   return { initializeRenter, renters, isLoading }
}

export default useRenter
