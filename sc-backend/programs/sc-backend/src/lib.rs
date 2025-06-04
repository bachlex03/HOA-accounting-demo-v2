use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod enums;
pub mod modules;

use crate::modules::*;

pub use renter::instructions::initialize::*;
pub use renter::instructions::make_payment::*;
pub use admin::instructions::add_fee_charge::*;


declare_id!("ECYWXBoSFr6GKZDxFPT7AuV87iVChHA1fXRsNK7xWdwj");

#[program]
pub mod sc_backend {
    use super::*;

    pub fn initialize_renter(ctx: Context<InitializeRenter>, renter_name: String) -> Result<()> {
        modules::renter::services::initialize_renter(ctx, renter_name)
    }

    pub fn add_fee_charge(ctx: Context<AddFeeCharge>,fee_type: String, amount: u64, due_date: i64) -> Result<()> {
        modules::admin::services::add_fee_charge(ctx, fee_type, amount, due_date)
    }

    pub fn make_payment(ctx: Context<MakePayment>, _fee_id: u64) -> Result<()> {
        modules::renter::services::make_payment(ctx, _fee_id)
    }
}