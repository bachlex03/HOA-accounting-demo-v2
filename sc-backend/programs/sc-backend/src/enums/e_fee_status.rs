use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone, Default)]
pub enum EFeeStatus {
    #[default]
    Unpaid,
    Paid,
    Overdue,
}