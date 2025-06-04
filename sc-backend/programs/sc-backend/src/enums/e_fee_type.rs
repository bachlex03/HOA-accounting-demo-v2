use anchor_lang::prelude::*;

use crate::errors::fee_charge::FeeChargeError;

#[derive(AnchorSerialize, AnchorDeserialize, InitSpace, PartialEq, Clone)]
pub enum EFeeType {
    Monthly,
    OneTime,
    Special,
}

impl TryFrom<String> for EFeeType {
    type Error = Error;

    fn try_from(fee_type: String) -> Result<Self> {
        match fee_type.to_lowercase().as_str() {
            "monthly" => Ok(EFeeType::Monthly),
            "onetime" => Ok(EFeeType::OneTime),
            "special" => Ok(EFeeType::Special),
            _ => Err(FeeChargeError::InvalidFeeType.into()),
        }
    }
}