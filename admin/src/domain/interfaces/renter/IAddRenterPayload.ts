import type { PublicKey } from '@solana/web3.js'

export interface IAddRenterPayload {
   public_key: PublicKey
   secret_key: number[]
   private_key: string
   mnemonic: string
   renter_name: string
}
