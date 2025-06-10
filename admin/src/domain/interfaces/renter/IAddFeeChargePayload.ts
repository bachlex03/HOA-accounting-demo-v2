import type { PublicKey } from '@solana/web3.js'

export interface IAddFeeChargePayload {
   public_key: PublicKey
   fee_type: string
   amount: number
   due_date: string
   next_fee_id: number
}
