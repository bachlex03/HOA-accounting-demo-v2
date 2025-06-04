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
    const renterName = "Foo Bar";

    const renterSeeds = [Buffer.from("RENTER_STATE"), renterPubkey.toBuffer()];

    const [renterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      renterSeeds,
      program.programId
    );

    const tx = await program.methods
      .initializeRenter(renterName)
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
    console.log("[LOG:VAR]::enterAccount.bump: ", renterAccount.bump);
    console.log(
      "[LOG:VAR]::enterAccount.nextFeeId: ",
      renterAccount.nextFeeId.toNumber()
    );
    console.log(
      "[LOG:VAR]::enterAccount.createdAt: ",
      renterAccount.createdAt.toNumber()
    );
    console.log(
      "[LOG:VAR]::enterAccount.updatedAt: ",
      renterAccount.updatedAt.toNumber()
    );
  });

  it("Add fee to renter!", async () => {
    const feeType = "Monthly";
    const amount = new anchor.BN(100); // Use BN for u64
    const dueDate = new anchor.BN(1751241600); // Date and time (your time zone): Monday, June 30, 2025 7:00:00 AM GMT+07:00
    const nextFeeId = new anchor.BN(0); // Assuming this is the first fee being added

    const renterAccountSeeds = [
      Buffer.from("RENTER_STATE"),
      renterPubkey.toBuffer(),
    ];
    const [renterAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      renterAccountSeeds,
      program.programId
    );
    const renterAccountData = await program.account.renterAccount.fetch(
      renterAccountPDA
    );
    console.log(
      "[LOG:VAR]::renterAccountData.renterName: ",
      renterAccountData.renterName
    );
    console.log(
      "[LOG:VAR]::renterAccountData.nextFeeId: ",
      renterAccountData.nextFeeId.toNumber()
    );

    const feeChargeSeeds = [
      Buffer.from("FEE_CHARGE_STATE"),
      ownerPubkey.toBuffer(),
      renterAccountPDA.toBuffer(),
      nextFeeId.toArrayLike(Buffer, "le", 8), // Convert BN to Buffer for nextFeeId
    ];

    const [feeChargeAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      feeChargeSeeds,
      program.programId
    );
    console.log(
      "[LOG:VAR]::feeChargeAccountPDA: ",
      feeChargeAccountPDA.toBase58()
    );

    const tx = await program.methods
      .addFeeCharge(feeType, amount, dueDate)
      .accounts({
        feeChargeAccount: feeChargeAccountPDA,
        toRenterAccount: renterAccountPDA,
        fromAuthority: ownerPubkey,
      })
      .rpc();

    console.log("[LOG:VAR]:tx::", tx);

    const feeChargeAccount = await program.account.feeChargeAccount.fetch(
      feeChargeAccountPDA
    );
    console.log(
      "[LOG:VAR]::feeChargeAccount.feeType: ",
      feeChargeAccount.feeType
    );
    console.log(
      "[LOG:VAR]::feeChargeAccount.amount: ",
      feeChargeAccount.amount.toNumber()
    );
    console.log(
      "[LOG:VAR]::feeChargeAccount.dueDate: ",
      feeChargeAccount.dueDate.toNumber()
    );

    assert.ok(
      "monthly" in feeChargeAccount.feeType,
      "feeType should be 'monthly'"
    );
    assert.ok(feeChargeAccount.amount.eq(amount));
    assert.ok(feeChargeAccount.dueDate.eq(dueDate));

    const renterAccount = await program.account.renterAccount.fetch(
      renterAccountPDA
    );
    console.log(
      "[LOG:VAR]::renterAccount.nextFeeId: ",
      renterAccount.nextFeeId.toNumber()
    );
  });

  it("Get all fees of renter", async () => {
    const renterAccountSeeds = [
      Buffer.from("RENTER_STATE"),
      renterPubkey.toBuffer(),
    ];

    const [renterAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      renterAccountSeeds,
      program.programId
    );
    const renterAccountData = await program.account.renterAccount.fetch(
      renterAccountPDA
    );
    console.log(
      "[LOG:VAR]::renterAccountData.renterName: ",
      renterAccountData.renterName
    );
    console.log(
      "[LOG:VAR]::renterAccountData.nextFeeId: ",
      renterAccountData.nextFeeId.toNumber()
    );

    const fees = await program.account.feeChargeAccount.all([
      {
        memcmp: {
          offset: 8 + 32, // Skip the discriminator
          bytes: renterAccountPDA.toBase58(), // Use the PDA of the renter account
        },
      },
    ]);

    console.log("[LOG:VAR]::fees: ", fees);
  });

  it("Make payment for fee", async () => {
    const feeId = new anchor.BN(0); // Assuming this is the first fee

    const renterAccountSeeds = [
      Buffer.from("RENTER_STATE"),
      renterPubkey.toBuffer(),
    ];

    const [renterAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      renterAccountSeeds,
      program.programId
    );
    const renterAccountData = await program.account.renterAccount.fetch(
      renterAccountPDA
    );
    console.log(
      "[LOG:VAR]::renterAccountData.renterName: ",
      renterAccountData.renterName
    );
    console.log(
      "[LOG:VAR]::renterAccountData.nextFeeId: ",
      renterAccountData.nextFeeId.toNumber()
    );

    console.log("[LOG:VAR]::ownerPubkey: ", ownerPubkey.toBase58());

    const feeChargeAccountSeeds = [
      Buffer.from("FEE_CHARGE_STATE"),
      ownerPubkey.toBuffer(),
      renterAccountPDA.toBuffer(),
      feeId.toArrayLike(Buffer, "le", 8), // Convert BN to Buffer for feeId
    ];

    const [feeChargeAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      feeChargeAccountSeeds,
      program.programId
    );
    console.log(
      "[LOG:VAR]::feeChargeAccountPDA: ",
      feeChargeAccountPDA.toBase58()
    );

    const feeChargeAccountData = await program.account.feeChargeAccount.fetch(
      feeChargeAccountPDA
    );
    console.log("[LOG:VAR]::feeChargeAccountData: ", feeChargeAccountData);

    const tx = await program.methods
      .makePayment(feeId)
      .accounts({
        renterAccount: renterAccountPDA,
        feeChargeAccount: feeChargeAccountPDA,
        authority: renterPubkey,
      })
      .signers([renter])
      .rpc();
    console.log("[LOG:VAR]:tx::", tx);

    const feeChargeAccount = await program.account.feeChargeAccount.fetch(
      feeChargeAccountPDA
    );
    console.log("[LOG:VAR]::feeChargeAccount: ", feeChargeAccount);
  });
});
