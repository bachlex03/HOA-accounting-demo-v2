import { Program, type Provider } from '@coral-xyz/anchor'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import idl from './idl.json'
import { ScBackend } from './idl.ts'

export const smartContractIdl = idl
export type smartContractIdlType = ScBackend
