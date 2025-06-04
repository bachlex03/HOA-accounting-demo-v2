use anchor_lang::prelude::*;

use crate::{constants};
use crate::{modules::renter::states::*};


#[derive(Accounts)]
#[instruction()]
pub struct AddFeeCharge<'info> {
    #[account(
        init,
        payer = from_authority,
        seeds = [
            constants::tag::FEE_CHARGE_TAG,
            from_authority.key().as_ref(), 
            to_renter_account.key().as_ref(),
            to_renter_account.next_fee_id.to_le_bytes().as_ref(),
        ],
        bump,
        space = 8 + FeeChargeAccount::INIT_SPACE
    )]
    pub fee_charge_account: Box<Account<'info, FeeChargeAccount>>,

    #[account(
        mut,
        seeds = [
            constants::tag::RENTER_TAG,
            to_renter_account.owner.key().as_ref()
        ],
        bump,
    )]
    pub to_renter_account: Box<Account<'info, RenterAccount>>,

    #[account(mut)]
    pub from_authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}