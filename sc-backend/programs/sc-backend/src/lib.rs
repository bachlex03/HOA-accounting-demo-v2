use anchor_lang::prelude::*;

declare_id!("ECYWXBoSFr6GKZDxFPT7AuV87iVChHA1fXRsNK7xWdwj");

#[program]
pub mod sc_backend {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
