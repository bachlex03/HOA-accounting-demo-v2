/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingOverlay } from "@/components/customs/LoadingOverlay";
import useProgram from "@/hooks/useProgram";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";

const FeeChargeTable = () => {
  const { program, connection, publicKey } = useProgram();
  const [isFetching, setIsFetching] = useState(false);

  const [fees, setFees] = useState<any[]>([]);

  // const fetchFees = useCallback(async () => {
  //   if (!connection || !program || !publicKey) return;

  //   try {
  //     setIsFetching(true);

  //     const renterAccountSeeds = [
  //       Buffer.from("RENTER_STATE"),
  //       publicKey.toBuffer(),
  //     ];

  //     const [renterAccountPDA] = PublicKey.findProgramAddressSync(
  //       renterAccountSeeds,
  //       program.programId
  //     );

  //     const renterAccountData =
  //       await program.account.renterAccount.fetch(renterAccountPDA);

  //     console.log("[LOG:VAR]::renterAccountData: ", renterAccountData);

  //     //   const fees = await program.account.feeChargeAccount.all([
  //     //     {
  //     //       memcmp: {
  //     //         offset: 8 + 32, // Skip the discriminator
  //     //         bytes: renterAccountPDA.toBase58(), // Use the PDA of the renter account
  //     //       },
  //     //     },
  //     //   ]);

  //     //   console.log("[LOG:VAR]::fees: ", fees);
  //   } catch (err) {
  //     console.error("Error fetching counter value:", err);
  //   } finally {
  //     setTimeout(() => {
  //       setIsFetching(false);
  //     }, 500);
  //   }
  // }, [connection]);

  // // Initial fetch and on connection change
  // useEffect(() => {
  //   if (connection) {
  //     fetchFees();
  //   }
  // }, [connection, fetchFees]);

  return (
    <div>
      <LoadingOverlay isLoading={isFetching} fullScreen />

      <h1>Table</h1>
    </div>
  );
};

export default FeeChargeTable;
