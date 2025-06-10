import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PublicKey } from '@solana/web3.js'
import type { IAddFeeChargePayload } from '../interfaces/renter/IAddFeeChargePayload'

const addFeeChargeSchema = z.object({
   public_key: z
      .custom<PublicKey>(
         (value: string) => {
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
   next_fee_id: z.number().min(0, {
      message: 'Next fee id must be a positive number',
   }),
   due_date: z
      .date({
         required_error: 'Choose a date',
         invalid_type_error: 'Choose a date',
      })
      .refine((date) => date > new Date(), {
         message: 'Event valid from date must be in the future',
      }),
   fee_type: z.string().min(1, {
      message: 'Fee type is required',
   }),
   amount: z
      .number({
         required_error: 'Enter an amount',
         invalid_type_error: 'Enter an amount',
      })
      .min(0, {
         message: 'Amount must be a positive number',
      }),
} satisfies Record<keyof IAddFeeChargePayload, z.ZodTypeAny>)

export type TAddFeeChargePayload = z.infer<typeof addFeeChargeSchema>
export const addFeeChargeResolver = zodResolver(addFeeChargeSchema)
