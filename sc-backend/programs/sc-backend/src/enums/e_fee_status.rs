// use std::fmt;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, PartialEq, Clone, Copy, Default)]
pub enum EFeeStatus {
    #[default]
    Unpaid,
    Paid,
    Overdue,
}

// impl fmt::Display for EFeeStatus {
//     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
//         match self {
//             EFeeStatus::Unpaid => write!(f, "Unpaid"),
//             EFeeStatus::Paid => write!(f, "Paid"),
//             EFeeStatus::Overdue => write!(f, "Overdue"),
//         }
//     }
// }