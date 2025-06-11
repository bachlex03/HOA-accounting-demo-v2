import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import useProgram from "@/hooks/useProgram";
import useTransactionToast from "@/hooks/useTransactionToast";
import * as anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { CreditCard } from "lucide-react";
import { useState } from "react";

const MakePaymentButton = ({
  feeId,
  feeCreatorPubkey,
  setIsTransactionPending,
}: {
  feeId: number;
  feeCreatorPubkey: PublicKey;
  setIsTransactionPending: (bool: boolean) => void;
}) => {
  const { publicKey, connected, program } = useProgram();
  const { renterAccount } = useAuth();
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  useTransactionToast({ transactionSignature });

  const handlePayment = async () => {
    if (!publicKey || !renterAccount || !wallet.publicKey) return;

    try {
      setIsLoading(true);
      setIsTransactionPending(true);

      const feeIdBN = new anchor.BN(feeId);

      console.log("Making payment for feeId:", feeIdBN);
      console.log("Making payment for feeId:", feeIdBN.toString());
      console.log(
        "Making payment for feeId:",
        feeIdBN.toArrayLike(Buffer, "le", 8)
      );

      const feeChargeAccountSeeds = [
        Buffer.from("FEE_CHARGE_STATE"),
        feeCreatorPubkey.toBuffer(),
        renterAccount.pdaPubkey.toBuffer(),
        feeIdBN.toArrayLike(Buffer, "le", 8),
      ];

      console.log("feeChargeAccountSeeds:", feeChargeAccountSeeds);

      const [feeChargeAccountPDA] = PublicKey.findProgramAddressSync(
        feeChargeAccountSeeds,
        program.programId
      );
      console.log(
        "[LOG:VAR]::feeChargeAccountPDA: ",
        feeChargeAccountPDA.toBase58()
      );

      const params = {
        renterAccount: renterAccount.pdaPubkey,
        feeChargeAccount: feeChargeAccountPDA,
        authority: publicKey,
      };

      const txSignature = await program.methods
        .makePayment(feeIdBN)
        .accounts(params)
        .rpc();

      setTransactionSignature(txSignature);
    } catch (err) {
      console.error("Error making payment:", err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      setIsTransactionPending(false);
    }
  };
  return (
    <Button
      size="sm"
      className="h-8"
      onClick={handlePayment}
      disabled={isLoading || !connected}
    >
      <CreditCard className="w-3 h-3 mr-1" />
      {isLoading ? "Processing..." : "Pay"}
    </Button>
  );
};

export default MakePaymentButton;
