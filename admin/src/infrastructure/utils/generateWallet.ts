import * as bs58 from 'bs58'
import * as bip39 from 'bip39'
import { HDKey } from 'micro-ed25519-hdkey'
import { Keypair, PublicKey } from '@solana/web3.js'

type TNewWalletData = {
   timestamp: string
   mnemonic: string
   seed: string
   publicKey: PublicKey
   privateKey: string
   secretKey: number[]
   derivationPath: string
}

const generateWallet = () => {
   const mnemonic = bip39.generateMnemonic()
   console.log('[LOG:VAR]::mnemonic: ', mnemonic)

   const seed = bip39.mnemonicToSeedSync(mnemonic, '')
   console.log('[LOG:VAR]::seed: ', seed)

   // derive HD key from seed
   const hdKey = HDKey.fromMasterSeed(seed.toString('hex'))

   // derive keypair from HD key and specified path
   const keypair = Keypair.fromSeed(hdKey.derive(`m/44'/501'/0'/0'`).privateKey)
   console.log('[LOG:VAR]::keypair.publicKey: ', keypair.publicKey.toBase58())
   console.log('[LOG:VAR]::keypair.secretKey: ', keypair.secretKey)
   console.log('[LOG:VAR]::keypair.secretKey: ', keypair.secretKey.toString())

   const privateKeyBase58 = bs58.default.encode(keypair.secretKey) // Convert to base58
   console.log('[LOG:VAR]::privateKeyBase58: ', privateKeyBase58)

   // Prepare wallet data
   const walletData: TNewWalletData = {
      timestamp: new Date().toISOString(),
      mnemonic: mnemonic,
      seed: seed.toString('hex'),
      publicKey: keypair.publicKey,
      privateKey: privateKeyBase58,
      secretKey: Array.from(keypair.secretKey),
      derivationPath: "m/44'/501'/0'/0'",
   }

   return walletData
}

export default generateWallet
