use anchor_lang::prelude::*;

use crate::{constants};
use crate::{modules::renter::states::*};

#[derive(Accounts)]
#[instruction(fee_id: u64)]
pub struct MakePayment<'info> {
    #[account(
        mut,
        seeds = [
            constants::tag::RENTER_TAG,
            authority.key().as_ref()
        ],
        bump,
    )]
    renter_account: Box<Account<'info, RenterAccount>>,

    #[account(
        mut,
        seeds = [
            constants::tag::FEE_CHARGE_TAG,
            fee_charge_account.from_admin.key().as_ref(),
            renter_account.key().as_ref(),
            fee_id.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub fee_charge_account: Box<Account<'info, FeeChargeAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}