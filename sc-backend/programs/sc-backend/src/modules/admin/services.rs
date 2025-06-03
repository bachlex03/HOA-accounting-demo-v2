use anchor_lang::prelude::*;

use crate::modules::admin::instructions::add_fee_charge::AddFeeCharge;
use crate::enums::{e_fee_type::*, e_fee_status::*};
use crate::errors::fee_charge::FeeChargeError;


pub fn add_fee_charge(ctx: Context<AddFeeCharge>, fee_type: String, amount: u64, due_date: i64) -> Result<()> {
    let fee_charge_account = &mut ctx.accounts.fee_charge_account;

    fee_charge_account.from_admin = ctx.accounts.from_authority.key();
    fee_charge_account.to_renter = ctx.accounts.to_renter_account.key();
    fee_charge_account.status = EFeeStatus::Unpaid;

    fee_charge_account.fee_type = validate_fee_type(fee_type)?;

    require!(!(amount > 0), FeeChargeError::AmountMustBeGreaterThanZero);
    fee_charge_account.amount = amount;

    require!(due_date > Clock::get()?.unix_timestamp, FeeChargeError::DueDateMustBeInFuture);
    fee_charge_account.due_date = due_date;

    Ok(())
}

fn validate_fee_type(fee_type: String) -> Result<EFeeType> {
    match fee_type.as_str() {
        "Monthly" => Ok(EFeeType::Monthly),
        "OneTime" => Ok(EFeeType::OneTime),
        "Special" => Ok(EFeeType::Special),
        
        _ => Err(FeeChargeError::InvalidFeeType.into()),
    }
}