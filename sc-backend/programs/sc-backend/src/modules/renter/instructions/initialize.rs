use anchor_lang::prelude::*;

use crate::{constants, modules::renter::states::RenterAccount};

#[derive(Accounts)]
#[instruction()]
pub struct InitializeRenter<'info> {
    #[account(
        init,
        seeds = [constants::tag::RENTER_TAG, owner.key().as_ref()],
        bump,
        payer = authority, 
        space = 8 + RenterAccount::INIT_SPACE
    )]
    pub renter_account: Box<Account<'info, RenterAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    /// CHECK: who is the owner of the renter account
    pub owner: AccountInfo<'info>,
   
    pub system_program: Program<'info, System>,
}