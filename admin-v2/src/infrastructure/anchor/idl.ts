/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sc_backend.json`.
 */
export type ScBackend = {
  address: 'ECYWXBoSFr6GKZDxFPT7AuV87iVChHA1fXRsNK7xWdwj'
  metadata: {
    name: 'scBackend'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'addFeeCharge'
      discriminator: [89, 113, 20, 169, 159, 22, 224, 243]
      accounts: [
        {
          name: 'feeChargeAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [70, 69, 69, 95, 67, 72, 65, 82, 71, 69, 95, 83, 84, 65, 84, 69]
              },
              {
                kind: 'account'
                path: 'fromAuthority'
              },
              {
                kind: 'account'
                path: 'toRenterAccount'
              },
              {
                kind: 'account'
                path: 'to_renter_account.next_fee_id'
                account: 'renterAccount'
              }
            ]
          }
        },
        {
          name: 'toRenterAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [82, 69, 78, 84, 69, 82, 95, 83, 84, 65, 84, 69]
              },
              {
                kind: 'account'
                path: 'to_renter_account.owner'
                account: 'renterAccount'
              }
            ]
          }
        },
        {
          name: 'fromAuthority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'feeType'
          type: 'string'
        },
        {
          name: 'amount'
          type: 'u64'
        },
        {
          name: 'dueDate'
          type: 'i64'
        }
      ]
    },
    {
      name: 'initializeRenter'
      discriminator: [40, 208, 200, 82, 163, 135, 25, 158]
      accounts: [
        {
          name: 'renterAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [82, 69, 78, 84, 69, 82, 95, 83, 84, 65, 84, 69]
              },
              {
                kind: 'account'
                path: 'owner'
              }
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'owner'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'renterName'
          type: 'string'
        }
      ]
    },
    {
      name: 'makePayment'
      discriminator: [19, 128, 153, 121, 221, 192, 91, 53]
      accounts: [
        {
          name: 'renterAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [82, 69, 78, 84, 69, 82, 95, 83, 84, 65, 84, 69]
              },
              {
                kind: 'account'
                path: 'authority'
              }
            ]
          }
        },
        {
          name: 'feeChargeAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [70, 69, 69, 95, 67, 72, 65, 82, 71, 69, 95, 83, 84, 65, 84, 69]
              },
              {
                kind: 'account'
                path: 'fee_charge_account.from_admin'
                account: 'feeChargeAccount'
              },
              {
                kind: 'account'
                path: 'renterAccount'
              },
              {
                kind: 'arg'
                path: 'feeId'
              }
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'feeId'
          type: 'u64'
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'feeChargeAccount'
      discriminator: [207, 103, 122, 41, 254, 167, 96, 201]
    },
    {
      name: 'renterAccount'
      discriminator: [185, 207, 225, 193, 242, 12, 125, 45]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'invalidFeeType'
      msg: 'Invalid fee type provided.'
    },
    {
      code: 6001
      name: 'amountMustBeGreaterThanZero'
      msg: 'The amount must be greater than zero.'
    },
    {
      code: 6002
      name: 'dueDateMustBeInFuture'
      msg: 'Due date must be in the future.'
    },
    {
      code: 6003
      name: 'feeAlreadyPaid'
      msg: 'The fee charge is already paid.'
    },
    {
      code: 6004
      name: 'feeOverdue'
      msg: 'The fee charge is overdue.'
    }
  ]
  types: [
    {
      name: 'eFeeStatus'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'unpaid'
          },
          {
            name: 'paid'
          },
          {
            name: 'overdue'
          }
        ]
      }
    },
    {
      name: 'eFeeType'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'monthly'
          },
          {
            name: 'oneTime'
          },
          {
            name: 'special'
          }
        ]
      }
    },
    {
      name: 'feeChargeAccount'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'fromAdmin'
            type: 'pubkey'
          },
          {
            name: 'toRenter'
            type: 'pubkey'
          },
          {
            name: 'feeId'
            type: 'u64'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'feeType'
            type: {
              defined: {
                name: 'eFeeType'
              }
            }
          },
          {
            name: 'status'
            type: {
              defined: {
                name: 'eFeeStatus'
              }
            }
          },
          {
            name: 'dueDate'
            type: 'i64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'updatedAt'
            type: 'i64'
          }
        ]
      }
    },
    {
      name: 'renterAccount'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'renterName'
            type: 'string'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'nextFeeId'
            type: 'u64'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'updatedAt'
            type: 'i64'
          }
        ]
      }
    }
  ]
  constants: [
    {
      name: 'feeChargeTag'
      type: 'bytes'
      value: '[70, 69, 69, 95, 67, 72, 65, 82, 71, 69, 95, 83, 84, 65, 84, 69]'
    },
    {
      name: 'renterTag'
      type: 'bytes'
      value: '[82, 69, 78, 84, 69, 82, 95, 83, 84, 65, 84, 69]'
    }
  ]
}
