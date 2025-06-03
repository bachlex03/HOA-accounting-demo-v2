import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ScBackend } from "../target/types/sc_backend";
import assert from "assert";

describe("sc-backend", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.scBackend as Program<ScBackend>;

  const owner = anchor.AnchorProvider.local().wallet;
  const ownerPubkey = owner.publicKey;

  const renter = anchor.web3.Keypair.generate();
  const renterPubkey = renter.publicKey;

  it("Initialize renter!", async () => {
    const renterSeeds = [Buffer.from("RENTER_STATE"), renterPubkey.toBuffer()];

    const [renterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      renterSeeds,
      program.programId
    );

    const tx = await program.methods
      .initializeRenter()
      .accounts({
        owner: renterPubkey,
        authority: ownerPubkey,
        renterAccount: renterPDA,
      })
      .rpc();

    console.log("[LOG:VAR]:tx::", tx);

    const renterAccount = await program.account.renterAccount.fetch(renterPDA);

    console.log(
      "[LOG:VAR]::enterAccount.renterName: ",
      renterAccount.renterName
    );
    console.log(
      "[LOG:VAR]::enterAccount.feeToChargeAmount: ",
      renterAccount.feeToChargeAmount.toNumber()
    );
    console.log(
      "[LOG:VAR]::enterAccount.feeUnchargedCount: ",
      renterAccount.feeUnchargedCount.toNumber()
    );

    // assert.ok(renterAccount.owner.equals(renterPubkey));
    // assert.equal(renterAccount.feeToChargeAmount.toNumber(), 0);
    // assert.equal(renterAccount.feeUnchargedCount.toNumber(), 0);
  });

  // it("Add fee to renter!", async () => {
  //   const amount = new anchor.BN(100);
  //   const feeType = "Monthly";
  //   const dueDate = new anchor.BN(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

  //   const feeChargeSeeds = [];

  //   const [feeChargeAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     feeChargeSeeds,
  //     program.programId
  //   );

  //   const renterAccountSeeds = [
  //     Buffer.from("RENTER_STATE"),
  //     renterPubkey.toBuffer(),
  //   ];

  //   const [renterAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  //     renterAccountSeeds,
  //     program.programId
  //   );

  //   const tx = await program.methods
  //     .addFeeCharge(feeType, amount, dueDate)
  //     .accounts({
  //       feeChargeAccount: feeChargeAccountPDA,
  //       fromAuthority: ownerPubkey,
  //       toRenterAccount: renterAccountPDA,
  //     })
  //     .rpc();
  //   console.log("[LOG:VAR]:tx::", tx);

  //   const feeChargeAccount = await program.account.feeChargeAccount.fetch(
  //     feeChargeAccountPDA
  //   );
  //   console.log(
  //     "[LOG:VAR]::feeChargeAccount.feeType: ",
  //     feeChargeAccount.feeType
  //   );
  //   console.log(
  //     "[LOG:VAR]::feeChargeAccount.amount: ",
  //     feeChargeAccount.amount.toNumber()
  //   );
  //   console.log(
  //     "[LOG:VAR]::feeChargeAccount.dueDate: ",
  //     feeChargeAccount.dueDate.toNumber()
  //   );
  // });
});
