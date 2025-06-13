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
import useTransactionToast from '@/hooks/useTransactionToast'
import { useLoadingOverlay } from '@/components/providers/LoadingOverlayProvider'
import type { TAddRenterPayload } from '@/domain/schemas/renter.schema'

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
      addRenterAsync: (payload: TAddRenterPayload) => Promise<void>
      refetch?: () => void
   }
   feeChargeAccount: {
      fees: TFeeChargeAccount[]
      unpaidFees: TFeeChargeAccount[]
      overDueFees: TFeeChargeAccount[]
      isFetching: boolean
      addFeeChargeAsync: (payload: TAddFeeChargePayload) => Promise<void>
      refetch?: () => void
   }
}

const AccountingContext = createContext<AccountingContext | null>(null)

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [transactionSignature, setTransactionSignature] = useState<
      string | null
   >(null)

   const { program, connection, publicKey } = useProgram()
   const { isLoading, showLoading, hideLoading } = useLoadingOverlay()

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

   useTransactionToast({ transactionSignature })

   //  RenterAccount
   const fetchRentersAsync = useCallback(async () => {
      if (!connection || !program || !publicKey) return

      try {
         showLoading()
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
            hideLoading()
         }, 500)
      }
   }, [connection])

   const addRenterAsync = async (payload: TAddRenterPayload) => {
      if (program && publicKey) {
         try {
            showLoading()
            setRenterAccount((prev) => ({ ...prev, isFetching: true }))

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
            const txSignature = await program.methods
               .initializeRenter(payload.renter_name)
               .accounts({
                  ...params,
               })
               .rpc()

            setTransactionSignature(txSignature)

            await fetchFeesAsync()

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
               setRenterAccount((prev) => ({ ...prev, isFetching: false }))
               hideLoading()
            }, 500)
         }
      }
   }

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
            'sortedFees',
            sortedFees.map((fee) => {
               return {
                  feePubkey: fee.publicKey.toBase58(),
                  feeAmount: fee.data.feeAmount,
                  renterPubkey: fee.data.toRenter.toBase58(),
               }
            }),
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
            showLoading()
            setFeeChargeAccount((prev) => ({ ...prev, isFetching: true }))

            const timeStamp = payload.due_date.getTime() / 1000
            // console.log('timeStamp', timeStamp)
            const amount = new anchor.BN(payload.amount)
            // console.log('amount', amount)
            const dueDate = new anchor.BN(timeStamp) // Convert to seconds since epoch
            // console.log('dueDate', dueDate)
            const nextFeeId = new anchor.BN(payload.next_fee_id) // Assuming this is the first fee being added
            // console.log('nextFeeId', nextFeeId)

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
            // console.log(
            //    '[LOG:VAR]::feeChargeAccountPDA: ',
            //    feeChargeAccountPDA.toBase58(),
            // )

            const params = {
               feeChargeAccount: feeChargeAccountPDA,
               toRenterAccount: renterAccountPDA,
               fromAuthority: publicKey,
            }

            const txSignature = await program.methods
               .addFeeCharge(payload.fee_type, amount, dueDate)
               .accounts(params)
               .rpc()

            // console.log('[LOG:VAR]:txSignature::', txSignature)

            // const feeChargeAccount =
            //    await program.account.feeChargeAccount.fetch(feeChargeAccountPDA)
            // console.log(
            //    '[LOG:VAR]::feeChargeAccount.feeType: ',
            //    feeChargeAccount.feeType,
            // )
            // console.log(
            //    '[LOG:VAR]::feeChargeAccount.amount: ',
            //    feeChargeAccount.amount.toNumber(),
            // )
            // console.log(
            //    '[LOG:VAR]::feeChargeAccount.dueDate: ',
            //    feeChargeAccount.dueDate.toNumber(),
            // )

            setTransactionSignature(txSignature)

            await fetchFeesAsync()
         } catch (err) {
            console.error('Error adding fee charge:', err)
         } finally {
            setTimeout(() => {
               setFeeChargeAccount((prev) => ({ ...prev, isFetching: false }))
               hideLoading()
            }, 500)
         }
      }
   }

   useEffect(() => {
      if (connection) {
         fetchRentersAsync()
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
            addRenterAsync: addRenterAsync,
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
