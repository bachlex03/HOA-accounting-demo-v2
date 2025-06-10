import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ScBackend } from "../target/types/sc_backend";
import * as bs58 from "bs58";
import * as bip39 from "bip39";
import { HDKey } from "micro-ed25519-hdkey";
import assert from "assert";
import { Keypair } from "@solana/web3.js";

describe("sc-backend", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.scBackend as Program<ScBackend>;
  const connection = anchor.getProvider().connection;

  const owner = anchor.AnchorProvider.local().wallet;
  const ownerPubkey = owner.publicKey;

  // const renter = anchor.web3.Keypair.generate();

  // const renterPubkey = renter.publicKey;
  // const renterSecretKey = renter.secretKey;

  const mnemonic = bip39.generateMnemonic();
  console.log("[LOG:VAR]::mnemonic: ", mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic, "");
  console.log("[LOG:VAR]::seed: ", seed);

  // derive HD key from seed
  const hdKey = HDKey.fromMasterSeed(seed.toString("hex"));

  // derive keypair from HD key and specified path
  const keypair = Keypair.fromSeed(hdKey.derive(`m/44'/501'/0'/0'`).privateKey);

  console.log("[LOG:VAR]::keypair.publicKey: ", keypair.publicKey.toBase58());
  console.log("[LOG:VAR]::keypair.secretKey: ", keypair.secretKey);
  console.log("[LOG:VAR]::keypair.secretKey: ", keypair.secretKey.toString());

  const privateKeyBase58 = bs58.default.encode(keypair.secretKey); // Convert to base58
  console.log("[LOG:VAR]::privateKeyBase58: ", privateKeyBase58);

  const renter = keypair; // Use the generated keypair as renter
  const renterPubkey = renter.publicKey;

  it("Initialize renter!", async () => {
    const renterName = "Foo Bar";

    // way 2
    // const mnemonic = bip39.generateMnemonic();
    // console.log("[LOG:VAR]::mnemonic: ", mnemonic);

    // const seed = await bip39.mnemonicToSeed(mnemonic);
    // console.log("[LOG:VAR]::seed: ", seed);

    // const derivedSeed = derivePath(
    //   "m/44'/501'/0'/0'",
    //   seed.toString("hex")
    // ).key;
    // console.log("[LOG:VAR]::derivedSeed: ", derivedSeed);

    // const keypair = Keypair.fromSeed(derivedSeed.slice(0, 32));

    // console.log("[LOG:VAR]::keypair.publicKey: ", keypair.publicKey.toBase58());
    // console.log("[LOG:VAR]::keypair.secretKey: ", keypair.secretKey);
    // console.log("[LOG:VAR]::keypair.secretKey: ", keypair.secretKey.toString());

    // const privateKeyBase58 = bs58.default.encode(keypair.secretKey); // Convert to base58
    // console.log("[LOG:VAR]::privateKeyBase58: ", privateKeyBase58);

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
    console.log(
      "[LOG:VAR]::enterAccount.owner: ",
      renterAccount.owner.toBase58()
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
    console.log("renterAccountPDA", renterAccountPDA.toBase58());

    const renterAccountData = await program.account.renterAccount.fetch(
      renterAccountPDA
    );
    console.log(
      "[LOG:VAR]::renterAccountData.renterName: ",
      renterAccountData.renterName
    );
    console.log(
      "[LOG:VAR]::renterAccountData.owner: ",
      renterAccountData.owner.toBase58()
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
      "[LOG:VAR]::feeChargeAccount.toRenter: ",
      feeChargeAccount.toRenter.toBase58()
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

  it("Fetch all unpaid fees", async () => {
    const unpaidFees = await program.account.feeChargeAccount.all([
      {
        memcmp: {
          offset: 8 + 32 + 32 + 8 + 8 + 1, // Offset to status field (discriminator + from_admin + to_renter + fee_id + amount + fee_type)
          bytes: "1", // Filter for unpaid fees (status = 1)
        },
      },
    ]);

    console.log("[LOG:VAR]::unpaidFees: ", unpaidFees);
  });

  it("Fetch all paid fees", async () => {
    const paidStatus = Buffer.from([1]); // Byte for Paid (0x00)
    const base58Encoded = bs58.default.encode(paidStatus); // Outputs "2"
    const dataSize = program.account.feeChargeAccount.size;

    const paidFees = await program.account.feeChargeAccount.all([
      {
        memcmp: {
          offset: 89, // Offset to status field (discriminator + from_admin + to_renter + fee_id + amount + fee_type)
          bytes: base58Encoded, // Filter for paid fees (status = 0x01, base58-encoded as "2")
        },
      },
      {
        dataSize: dataSize, // Size of FeeChargeAccount (including discriminator)
      },
    ]);

    console.log("[LOG:VAR]::paidFees: ", paidFees);
  });

  it("pagination for paid fees", async () => {
    const pageSize = 10; // Number of accounts per page
    let after: string | undefined = undefined; // Start from the beginning
    let hasMore = true;
    let page = 1;

    const paidStatus = Buffer.from([1]); // Byte for Paid (0x00)
    const base58Encoded = bs58.default.encode(paidStatus); // Outputs "2"
    const dataSize = program.account.feeChargeAccount.size;

    while (hasMore) {
      console.log(`[LOG:VAR]::Fetching page ${page}`);

      const filters = [
        {
          memcmp: {
            offset: 89,
            bytes: base58Encoded,
          },
        },
        {
          dataSize: dataSize,
        },
      ];

      const accounts = await connection.getProgramAccounts(program.programId, {
        filters: filters,
        commitment: "confirmed",
        encoding: "base64",
        dataSlice: { offset: 0, length: 115 }, // Fetch full account data
        // Pagination
        ...(after ? { after } : {}),
      });

      // Decode accounts into FeeChargeAccount
      const decodedAccounts = accounts.map(({ pubkey, account }) => {
        const data = account.data;
        const feeChargeAccount = program.coder.accounts.decode(
          "feeChargeAccount",
          data
        );
        return { publicKey: pubkey, account: feeChargeAccount };
      });

      // Log results for this page
      console.log(`[LOG:VAR]::Page ${page} paidFees:`, decodedAccounts);
      decodedAccounts.forEach((fee) => {
        console.log({
          publicKey: fee.publicKey.toBase58(),
          feeId: fee.account.feeId.toNumber(),
          amount: fee.account.amount.toNumber(),
          feeType: fee.account.feeType,
          status: fee.account.status,
          dueDate: fee.account.dueDate.toNumber(),
        });
      });

      // Update pagination
      hasMore = accounts.length === pageSize; // Continue if we got a full page
      after =
        accounts.length > 0
          ? accounts[accounts.length - 1].pubkey.toBase58()
          : undefined;
      page++;

      // Stop if no more accounts or less than pageSize (end of results)
      if (accounts.length < pageSize) {
        hasMore = false;
      }
    }

    console.log("[LOG]::Pagination complete");
  });

  it("Fetch all fees belong to creator", async () => {
    // Fetch all fee charge accounts that belong to the creator (admin)
    const creatorFees = await program.account.feeChargeAccount.all([
      {
        memcmp: {
          offset: 8, // Skip discriminator (8 bytes) to get to from_admin field
          bytes: ownerPubkey.toBase58(), // Filter by creator's public key
        },
      },
    ]);

    console.log("[LOG:VAR]::creatorFees: ", creatorFees);
    console.log("[LOG:VAR]::creatorFees.length: ", creatorFees.length);

    // Log detailed information about each fee
    creatorFees.forEach((fee, index) => {
      console.log(`[LOG:VAR]::Fee ${index + 1}:`, {
        publicKey: fee.publicKey.toBase58(),
        fromAdmin: fee.account.fromAdmin.toBase58(),
        toRenter: fee.account.toRenter.toBase58(),
        feeId: fee.account.feeId.toNumber(),
        amount: fee.account.amount.toNumber(),
        feeType: fee.account.feeType,
        status: fee.account.status,
        dueDate: fee.account.dueDate.toNumber(),
        createdAt: fee.account.createdAt.toNumber(),
        updatedAt: fee.account.updatedAt.toNumber(),
      });
    });

    // Assert that we found at least one fee created by this admin
    assert.ok(creatorFees.length > 0, "Creator should have at least one fee");

    // Verify that all fees belong to the correct creator
    creatorFees.forEach((fee) => {
      assert.ok(
        fee.account.fromAdmin.equals(ownerPubkey),
        "All fees should belong to the creator"
      );
    });
  });
});
