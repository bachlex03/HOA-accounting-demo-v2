import { Program, type Provider } from '@coral-xyz/anchor'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import idl from './idl.json'
import { type ScBackend } from './idl'

export const smartContractIdl = idl
