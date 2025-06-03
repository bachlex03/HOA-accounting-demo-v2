use anchor_lang::prelude::*;

#[error_code]
pub enum AuthError {
    #[msg("Unauthorized")]
    Unauthorized,
}