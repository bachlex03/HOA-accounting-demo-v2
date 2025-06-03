use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, Clone)]
pub enum EFeeType {
    Monthly,
    OneTime,
    Special,
}