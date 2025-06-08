import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncatePublicKey = (publicKey: string, startChars: number = 4, endChars: number = 4): string => {
  if (publicKey.length <= startChars + endChars) {
    return publicKey
  }
  return `${publicKey.slice(0, startChars)}...${publicKey.slice(-endChars)}`
}
