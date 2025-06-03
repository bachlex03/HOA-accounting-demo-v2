use anchor_lang::prelude::*;

#[error_code]
pub enum FeeChargeError {
    #[msg("Invalid fee type provided.")]
    InvalidFeeType,

    #[msg("The amount must be greater than zero.")]
    AmountMustBeGreaterThanZero,

    #[msg("Due date must be in the future.")]
    DueDateMustBeInFuture,
}