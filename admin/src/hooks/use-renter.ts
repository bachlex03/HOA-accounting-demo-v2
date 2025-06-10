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
            try {
               setIsLoading(true)
               const renterSeeds = [
                  Buffer.from('RENTER_STATE'),
                  publicKey.toBuffer(),
               ]
               const [renterPda] = PublicKey.findProgramAddressSync(
                  renterSeeds,
                  program.programId,
               )
               const params = {
                  renter: renterPda,
                  owner: payload.public_key,
                  authority: publicKey,
               }
               await program.methods
                  .initializeRenter(payload.renter_name)
                  .accounts({
                     ...params,
                  })
                  .rpc()

               const modifiedData = {
                  ...payload,
                  secret_key: JSON.stringify(payload.secret_key), // Convert array to string like "[152,125,...]"
               }

               // Save as downloadable file
               const dataStr = JSON.stringify(modifiedData, null, 2)
               const dataBlob = new Blob([dataStr], {
                  type: 'application/json',
               })
               const url = URL.createObjectURL(dataBlob)
               const link = document.createElement('a')
               link.href = url
               link.download = `wallet-${payload.public_key.toBase58()}-${payload.renter_name}.json`
               link.style.display = 'none'
               document.body.appendChild(link)
               link.click()
               document.body.removeChild(link)
               URL.revokeObjectURL(url)
            } catch (error) {
               console.error('[LOG:ERROR]::', error)
            } finally {
               setTimeout(() => {
                  setIsLoading(false)
               }, 500)
            }
         }
      }
   }

   const fetchRenters = async () => {
      try {
         if (program && publicKey) {
            setIsLoading(true)

            const renterData = await program.account.renterAccount.all([])

            setRenters(renterData)
         }
      } catch (error) {
         console.error('[LOG:ERROR]::', error)
      } finally {
         setTimeout(() => {
            setIsLoading(false)
         }, 500)
      }
   }

   useEffect(() => {
      fetchRenters()
   }, [])

   const refetch = () => {
      console.log('Refetching renters...')
      fetchRenters()
   }

   return { initializeRenter, refetch, renters, isLoading }
}

export default useRenter
