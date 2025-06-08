import type { PublicKey } from '@solana/web3.js';

export interface IAddRenterPayload {
   public_key: PublicKey;
   renter_name: string;
}
