use anchor_lang::prelude::*;

use crate::modules::admin::instructions::add_fee_charge::AddFeeCharge;
use crate::enums::{e_fee_type::*, e_fee_status::*};
use crate::errors::fee_charge::FeeChargeError;


pub fn add_fee_charge(ctx: Context<AddFeeCharge>, _fee_type: String, _amount: u64, _due_date: i64) -> Result<()> {
    let renter_account = &mut ctx.accounts.to_renter_account;
    let fee_charge_account = &mut ctx.accounts.fee_charge_account;

    let (fee_type, amount, due_date) = validate_input(&_fee_type, _amount, _due_date)?;

    fee_charge_account.from_admin = ctx.accounts.from_authority.key();
    fee_charge_account.to_renter = renter_account.owner.key();
    fee_charge_account.fee_id = renter_account.next_fee_id;
    fee_charge_account.status = EFeeStatus::Unpaid;
    fee_charge_account.fee_type = fee_type;
    fee_charge_account.amount = amount;
    fee_charge_account.due_date = due_date;
    fee_charge_account.bump = ctx.bumps.fee_charge_account;
    fee_charge_account.created_at = Clock::get()?.unix_timestamp;
    fee_charge_account.updated_at = fee_charge_account.created_at;

    renter_account.next_fee_id = renter_account.next_fee_id.checked_add(1).unwrap();

    Ok(())
}

fn validate_input(_fee_type: &str, _amount: u64, _due_date: i64) -> Result<(EFeeType, u64, i64)> {
    require!((_amount > 0), FeeChargeError::AmountMustBeGreaterThanZero);

    require!(_due_date > Clock::get()?.unix_timestamp, FeeChargeError::DueDateMustBeInFuture);

    let fee_type = EFeeType::try_from(_fee_type.to_string())?;

    Ok((fee_type, _amount, _due_date))
}