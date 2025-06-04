use anchor_lang::{prelude::*};

use crate::{enums::e_fee_status::EFeeStatus, modules::renter::instructions::{self}};
use crate::errors::fee_charge::FeeChargeError;

pub fn initialize_renter(ctx: Context<instructions::initialize::InitializeRenter>, renter_name: String) -> Result<()> {
    let renter_account = &mut ctx.accounts.renter_account;

    validate_input(&renter_name)?;

    renter_account.owner = ctx.accounts.owner.key();
    renter_account.renter_name =  renter_name;
    renter_account.bump = ctx.bumps.renter_account;
    renter_account.next_fee_id = 0;
    renter_account.created_at = Clock::get()?.unix_timestamp;
    renter_account.updated_at = Clock::get()?.unix_timestamp;

    Ok(())
}

fn validate_input(renter_name: &str) -> Result<()> {
    if renter_name.is_empty() || renter_name.len() > 50 {
        return Err(ProgramError::InvalidInstructionData.into());
    }
    
    Ok(())
}

pub fn make_payment(ctx: Context<instructions::make_payment::MakePayment>, _fee_id: u64) -> Result<()> {
    let fee_charge_account = &mut ctx.accounts.fee_charge_account;

    // require_eq!(fee_charge_account.status, EFeeStatus::Paid, FeeChargeError::FeeAlreadyPaid);
    require!(
        fee_charge_account.status == EFeeStatus::Unpaid || fee_charge_account.status == EFeeStatus::Overdue,
        FeeChargeError::FeeAlreadyPaid
    );

    fee_charge_account.status = EFeeStatus::Paid;
    fee_charge_account.updated_at = Clock::get()?.unix_timestamp;

    Ok(())
}