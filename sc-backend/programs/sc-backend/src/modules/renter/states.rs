use anchor_lang::prelude::*;
use crate::enums::{e_fee_type::*, e_fee_status::*};


#[account]
#[derive(InitSpace)]
pub struct RenterAccount {
    pub owner: Pubkey,
    #[max_len(50)]
    pub renter_name: String,
    pub fee_to_charge_amount: u64, // Amount to charge for fees
    pub fee_uncharged_count: u64, // Count of fees that have not been charged yet
}

#[account]
#[derive(InitSpace)]
pub struct FeeChargeAccount {
    pub from_admin: Pubkey,
    pub to_renter: Pubkey,
    pub amount: u64,
    pub due_date: i64,
    pub fee_type: EFeeType,
    pub status: EFeeStatus,
}

// #[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Default)]
// pub enum FeeStatus {
//     #[default]
//     Unpaid,
//     Paid,
//     Overdue,
// }

// #[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone)]
// pub enum FeeType {
//     Monthly,
//     OneTime,
//     Special,
// }

// In Rust, particularly in the context of your Anchor (Solana) code, the `Clone` trait is used to allow a type to be duplicated by creating a deep copy of its value. This is essential for types that need to be copied explicitly, as Rust’s default behavior for most types is to move ownership rather than copy when passing values around. Let’s break down why the `Clone` trait is used in your example and its significance.

// ### Why Use the `Clone` Trait?
// 1. **Explicit Copying**:
//    - Rust is designed with strict ownership rules, meaning variables are moved by default when assigned or passed to functions unless the type implements the `Copy` or `Clone` trait.
//    - The `Copy` trait is used for simple types (like integers or booleans) that can be copied implicitly because they are cheap to duplicate (stack-allocated, fixed-size data).
//    - For more complex types like `FeeStatus` and `FeeCharge` in your code, which may involve heap-allocated data (e.g., `String` in `RenterAccount` or nested structures), implementing `Copy` is not feasible. Instead, `Clone` is used to allow explicit copying when needed.
//    - In your code, `FeeStatus` (an enum) and `FeeCharge` (a struct containing a `u64`, `i64`, and `FeeStatus`) are marked with `#[derive(Clone)]`, enabling you to call `.clone()` to create a copy of these types when necessary.

// 2. **Anchor Framework Requirements**:
//    - Anchor, a framework for Solana smart contracts, often requires types to implement `Clone` for serialization, deserialization, and program interactions.
//    - When working with accounts or data structures in Anchor (like `RenterAccount` and `FeeCharge`), you may need to pass copies of data between program instructions or store them in different contexts. The `Clone` trait ensures you can duplicate these values safely without violating Rust’s ownership rules.
//    - For example, when serializing/deserializing data to/from the blockchain, Anchor may need to create temporary copies of structs or enums like `FeeCharge` or `FeeStatus` to process them, and `Clone` facilitates this.

// 3. **Flexibility in Data Manipulation**:
//    - In your code, `FeeCharge` contains a `Vec<FeeCharge>` in `RenterAccount`. If you need to manipulate or pass a `FeeCharge` instance (e.g., to update its `status` or read its `amount`), you might want to create a copy to avoid moving the original value out of the `Vec` or another owning context.
//    - The `Clone` trait allows you to call `.clone()` on `FeeCharge` or `FeeStatus` to create an independent copy, preserving the original data while working with the duplicate.

// 4. **Avoiding Ownership Issues**:
//    - Without `Clone`, passing `FeeCharge` or `FeeStatus` to a function or assigning it to a new variable would move ownership, potentially making the original variable unusable.
//    - By implementing `Clone`, you can explicitly create a copy (e.g., `let new_fee = fee_charge.clone();`) and work with it without affecting the original.

// ### Why `Clone` for `FeeStatus` and `FeeCharge` Specifically?
// - **For `FeeStatus`**:
//   - `FeeStatus` is an enum with variants `Unpaid`, `Paid`, and `Overdue`. While it’s a simple type, it’s not automatically `Copy` because enums with data or complex variants don’t implement `Copy` by default.
//   - Deriving `Clone` allows you to duplicate `FeeStatus` values when needed, such as when updating the `status` field in a `FeeCharge` instance or passing it to a function.

// - **For `FeeCharge`**:
//   - `FeeCharge` is a struct containing a `u64`, an `i64`, and a `FeeStatus`. Since it contains a `FeeStatus` (which itself requires `Clone`), and because structs with non-`Copy` fields don’t implement `Copy`, deriving `Clone` is necessary to make `FeeCharge` copyable.
//   - This is particularly useful when you need to store or manipulate multiple `FeeCharge` instances in the `RenterAccount`’s `fee_charges` vector without moving ownership.

// - **For `RenterAccount`**:
//   - Note that `RenterAccount` does *not* derive `Clone`. This is likely intentional, as it contains a `String` (heap-allocated) and a `Vec<FeeCharge>` (also heap-allocated), which are expensive to copy. Avoiding `Clone` here prevents accidental deep copying of potentially large data structures, encouraging explicit ownership management.

// ### Example of `Clone` in Action
// Here’s a simplified example of why `Clone` is useful in your code:

// ```rust
// let mut renter_account = RenterAccount {
//     renter_name: "Alice".to_string(),
//     fee_charges: vec![FeeCharge {
//         amount: 100,
//         due_date: 1234567890,
//         status: FeeStatus::Unpaid,
//     }],
// };

// // Need a copy of a FeeCharge to process it
// let fee_copy = renter_account.fee_charges[0].clone();
// match fee_copy.status {
//     FeeStatus::Unpaid => println!("Fee of {} is unpaid!", fee_copy.amount),
//     _ => println!("Other status"),
// }
// ```

// - Without `Clone`, accessing `renter_account.fee_charges[0]` and moving it would invalidate the vector’s contents or require complex borrowing patterns.
// - With `Clone`, you can safely create a copy of `FeeCharge` and work with it independently.

// ### When to Use `Clone`?
// - Use `Clone` when you need to duplicate data explicitly and the type doesn’t implement `Copy`.
// - In Anchor programs, derive `Clone` for types that will be serialized/deserialized or passed around frequently in program logic.
// - Be cautious with `Clone` for types with large data (like `Vec` or `String`), as cloning can be expensive in terms of performance. In such cases, consider using references (`&T`) or `Rc`/`Arc` for shared ownership if appropriate.

// ### Why Not `Copy` Instead of `Clone`?
// - The `Copy` trait is only suitable for types that are cheap to copy (e.g., primitives like `u64` or `i64`). `FeeStatus` and `FeeCharge` don’t qualify because:
//   - `FeeStatus` is an enum, and enums don’t automatically implement `Copy` unless all variants are `Copy`.
//   - `FeeCharge` contains fields that may not be `Copy` (e.g., `FeeStatus`), and structs with non-`Copy` fields cannot derive `Copy`.
// - `Clone` is more flexible because it allows explicit copying and can handle heap-allocated data, which is common in Anchor programs.

// ### Summary
// The `Clone` trait is used in your code for `FeeStatus` and `FeeCharge` to:
// - Enable explicit copying of these types in Rust’s ownership model.
// - Support Anchor’s serialization/deserialization requirements.
// - Allow safe manipulation of data without moving ownership.
// - Avoid runtime errors due to ownership violations when passing or storing data in Solana programs.

// By deriving `Clone`, you ensure that these types can be duplicated when needed, making your program logic more flexible and robust while adhering to Rust’s safety guarantees.