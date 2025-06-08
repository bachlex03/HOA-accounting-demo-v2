import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IAddRenterPayload } from '../interfaces/renter/IAddRenterPayload'
import { PublicKey } from '@solana/web3.js'

const RenterCreateSchema = z.object({
   public_key: z
      .custom<PublicKey>(
         (value: unknown) => {
            if (typeof value !== 'string') return false
            try {
               const publicKey = new PublicKey(value)
               return PublicKey.isOnCurve(publicKey)
            } catch {
               return false
            }
         },
         {
            message: 'Public key must be a valid Solana PublicKey string',
         },
      )
      .transform((value) => new PublicKey(value)),
   renter_name: z.string().min(1, 'Renter name is required'),
} satisfies Record<keyof IAddRenterPayload, z.ZodTypeAny>)

export type TAddRenterPayload = z.infer<typeof RenterCreateSchema>
export const addRenterResolver = zodResolver(RenterCreateSchema)
