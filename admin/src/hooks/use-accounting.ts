/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import useSolanaProgram from './use-solana-program'
import { useWallet } from '@solana/wallet-adapter-react'

const useAccounting = () => {
  const { program } = useSolanaProgram()
  const { publicKey } = useWallet()
  const [initialized, setInitialized] = useState(false)
  const [feeCharges, setFeeCharges] = useState<any>([])
  const [isTransactionPending, setIsTransactionPending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  console.log('feeCharges:', feeCharges)

  useEffect(() => {
    // fetch fee charges
    const fetchFeeCharges = async () => {
      if (program && publicKey && !isTransactionPending) {
        try {
          setIsLoading(true)

          const feeChargeAccounts = await program.account.feeChargeAccount.all([
            {
              memcmp: {
                offset: 8,
                bytes: publicKey.toBase58()
              }
            }
          ])

          console.log('Fee charge accounts:', feeChargeAccounts)

          setFeeCharges(feeChargeAccounts)
        } catch (error) {
          console.error('Error fetching fee charges:', error)
        }
      }
    }

    fetchFeeCharges()
  }, [publicKey, isTransactionPending])

  return {
    feeCharges
  }
}

export default useAccounting
