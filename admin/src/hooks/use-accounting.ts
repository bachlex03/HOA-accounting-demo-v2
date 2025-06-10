/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import useSolanaProgram from './use-solana-program'
import { useWallet } from '@solana/wallet-adapter-react'
import type { TAddFeeChargePayload } from '@/domain/schemas/fee.schema'
import { PublicKey } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'

const useAccounting = () => {
   const { program } = useSolanaProgram()
   const { publicKey } = useWallet()
   const [initialized, setInitialized] = useState(false)
   const [feeCharges, setFeeCharges] = useState<any>([])
   const [isLoading, setIsLoading] = useState(false)
   const [isSuccessAddFee, setIsSuccessAddFee] = useState(false)

   useEffect(() => {
      // fetch fee charges
      const fetchFeeCharges = async () => {
         if (program && publicKey) {
            try {
               setIsLoading(true)

               const feeChargeAccounts =
                  await program.account.feeChargeAccount.all([
                     {
                        memcmp: {
                           offset: 8,
                           bytes: publicKey.toBase58(),
                        },
                     },
                  ])

               setFeeCharges(feeChargeAccounts)
            } catch (error) {
               console.error('Error fetching fee charges:', error)
            } finally {
               setTimeout(() => {
                  setIsLoading(false)
               }, 500)
            }
         }
      }

      fetchFeeCharges()
   }, [publicKey])

   const addFeeCharge = async (payload: TAddFeeChargePayload) => {
      if (program && publicKey) {
         try {
            setIsLoading(true)
            setIsSuccessAddFee(false)

            console.log('Adding fee charge with payload:', payload)

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
            console.log('renterAccountPDA', renterAccountPDA)

            const renterAccountData =
               await program.account.renterAccount.fetch(renterAccountPDA)
            console.log(
               '[LOG:VAR]::renterAccountData.renterName: ',
               renterAccountData.renterName,
            )
            console.log(
               '[LOG:VAR]::renterAccountData.nextFeeId: ',
               renterAccountData.nextFeeId.toNumber(),
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

            setIsSuccessAddFee(true)
         } catch (error) {
            console.log('[LOG:VAR]:error::', error)
            setIsSuccessAddFee(false)
         } finally {
            setTimeout(() => {
               setIsLoading(false)
            }, 2000)
         }
      }
   }

   const unpaidFees = useMemo(
      () => feeCharges.filter((fee: any) => fee.account.status === 'unpaid'),
      [feeCharges],
   )
   const orderDueFees = useMemo(
      () => feeCharges.filter((fee: any) => fee.account.status === 'overdue'),
      [feeCharges],
   )

   return {
      feeCharges,
      unpaidFees,
      orderDueFees,
      addFeeCharge,
      isLoading,
      isSuccessAddFee,
   }
}

export default useAccounting
