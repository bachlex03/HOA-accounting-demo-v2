import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import type { ScBackend } from "@/infrastructure/anchor/idl";
import IDL from "../infrastructure/anchor/idl.json";

interface UseProgramReturn {
  program: anchor.Program<ScBackend>;
  publicKey: PublicKey | null;
  connection: anchor.web3.Connection;
  connected: boolean;
  connecting: boolean;
  disconnect: () => void;
}

/**
 * A hook that provides access to the Solana program, counter address,
 * connected wallet, and connection.
 * This hook handles the basic setup for the program.
 */
const useProgram = (): UseProgramReturn => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  let program;
  if (wallet) {
    // Create a provider with the wallet for transaction signing
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    program = new anchor.Program<ScBackend>(IDL, provider);
  } else {
    // Create program with just connection for read-only operations
    program = new anchor.Program<ScBackend>(IDL, { connection });
  }

  return {
    publicKey,
    program,
    connection,
    connecting,
    connected,
    disconnect,
  };
};

export default useProgram;
