use anchor_lang::prelude::*;

use crate::{constants};
use crate::{modules::renter::states::*};


#[derive(Accounts)]
#[instruction(_fee_type: String, _amount: u64, _due_date: i64)]
pub struct AddFeeCharge<'info> {
    #[account(
        init,
        payer = from_authority,
        seeds = [
            from_authority.key().as_ref(), 
            to_renter_account.key().as_ref(),
            _fee_type.as_bytes().as_ref(),
            _amount.to_be_bytes().as_ref(),
            _due_date.to_be_bytes().as_ref()],
        bump,
        space = 8 + FeeChargeAccount::INIT_SPACE
    )]
    pub fee_charge_account: Account<'info, FeeChargeAccount>,

    #[account(mut)]
    pub from_authority: Signer<'info>,

    #[account(
        mut,
        seeds = [constants::tag::RENTER_TAG, to_renter_account.owner.key().as_ref()],
        bump,
    )]
    pub to_renter_account: Account<'info, RenterAccount>,

    pub system_program: Program<'info, System>,
}