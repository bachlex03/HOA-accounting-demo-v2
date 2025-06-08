import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import * as anchor from '@coral-xyz/anchor'
import { smartContractIdl, type smartContractIdlType } from '@/infrastructure/anchor/setup'

const useSolanaProgram = () => {
  const { connection } = useConnection()
  const anchorWallet = useAnchorWallet()

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())

      anchor.setProvider(provider)

      return new anchor.Program<smartContractIdlType>(smartContractIdl, provider)
    }
  }, [connection, anchorWallet])

  return { program }
}

export default useSolanaProgram
