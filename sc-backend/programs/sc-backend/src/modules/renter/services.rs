use anchor_lang::prelude::*;

use crate::modules::renter::instructions::initialize::InitializeRenter;

pub fn initialize_renter(ctx: Context<InitializeRenter>) -> Result<()> {
    let renter_account = &mut ctx.accounts.renter_account;

    renter_account.owner = ctx.accounts.owner.key();
    renter_account.renter_name =  String::from("David Bach Bale");
    renter_account.fee_to_charge_amount = 0;
    renter_account.fee_uncharged_count = 0;

    Ok(())
}