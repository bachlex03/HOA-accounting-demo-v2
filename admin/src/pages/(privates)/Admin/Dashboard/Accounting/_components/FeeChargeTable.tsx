import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PiDotsThreeOutlineVertical } from 'react-icons/pi'
import RenterFeeTable from './RenterFeeTable'
import type { PublicKey } from '@solana/web3.js'
import {
   useAccountingPage,
   type TFeeChargeAccount,
   type TFeeStatus,
   type TFeeType,
} from '../_provider'

export type TFeeTable = {
   feeId: number
   ownerPubkey: PublicKey | null
   ownerPda: PublicKey | null
   ownerName: string
   paymentType: TFeeType
   amountDue: number
   dueDate: Date
   status: TFeeStatus
}

const FeeChargeTable = () => {
   const [tableFees, setTableFees] = useState<TFeeTable[]>([])
   const [selectedRow, setSelectedRow] = useState<TFeeTable | null>(null)

   const {
      renterAccount: { renters },
      feeChargeAccount: { unpaidFees, overDueFees },
   } = useAccountingPage()

   useEffect(() => {
      const table: TFeeTable[] = [...unpaidFees, ...overDueFees].map(
         (fee: TFeeChargeAccount) => {
            const renter = renters.find(
               (renter) =>
                  renter.data.owner.toBase58() === fee.data.toRenter.toBase58(),
            )

            return {
               feeId: fee.data.feeId,
               ownerPubkey: renter?.data.owner || null,
               ownerPda: renter?.publicKey || null,
               ownerName: renter?.data.renterName || 'Unknown',
               paymentType: fee.data.feeType,
               amountDue: fee.data.feeAmount,
               status: fee.data.feeStatus,
               dueDate: new Date(fee.data.dueDate * 1000),
            }
         },
      )

      setTableFees(table)
   }, [unpaidFees, overDueFees])

   return (
      <Table className="border">
         <TableHeader>
            <TableRow className="bg-[#F3EEFF] dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
               <TableHead className="font-medium w-[15%]">
                  Property Address
               </TableHead>
               <TableHead className="font-medium w-[25%]">Owner</TableHead>
               <TableHead className="font-medium w-[15%]">
                  Payment Type
               </TableHead>
               <TableHead className="font-medium w-[15%]">Amount Due</TableHead>
               <TableHead className="font-medium w-[15%]">Due Date</TableHead>
               <TableHead className="font-medium w-[10%]">Status</TableHead>
               <TableHead className="text-right font-medium w-[5%]"></TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {tableFees.map((fee: TFeeTable, index: number) => {
               return (
                  <TableRow key={index}>
                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        123 Abbey Rd., Unit 2
                     </TableCell>

                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        {fee.ownerName}
                     </TableCell>

                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        <Badge
                           variant="secondary"
                           className={cn(
                              'text-xs font-medium px-3 py-1 rounded-full border-0',
                              {
                                 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300':
                                    fee.paymentType === 'monthly',
                                 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300':
                                    fee.paymentType === 'special',
                              },
                           )}
                        >
                           {fee.paymentType}
                        </Badge>
                     </TableCell>

                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        ${fee.amountDue.toFixed(2)}
                     </TableCell>

                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        {fee.dueDate.toLocaleDateString('en-US', {
                           day: 'numeric',
                           month: 'short',
                           year: 'numeric',
                        })}
                     </TableCell>

                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        <Badge
                           className={cn(
                              'text-xs font-semibold px-3 py-1.5 rounded-full border-0 flex items-center gap-1.5 w-fit',
                              {
                                 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300':
                                    fee.status === 'overdue',
                                 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300':
                                    fee.status === 'unpaid',
                                 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300':
                                    fee.status === 'paid',
                              },
                           )}
                        >
                           <span
                              className={cn('w-2 h-2 rounded-full', {
                                 'bg-red-500': fee.status === 'overdue',
                                 'bg-yellow-500': fee.status === 'unpaid',
                                 'bg-green-500': fee.status === 'paid',
                              })}
                           />
                           {fee.status}
                        </Badge>
                     </TableCell>

                     <TableCell className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                        <RenterFeeTable selectedFee={selectedRow}>
                           <Button
                              variant={'ghost'}
                              onClick={() => {
                                 setSelectedRow(fee)
                              }}
                           >
                              <PiDotsThreeOutlineVertical size={20} />
                           </Button>
                        </RenterFeeTable>
                     </TableCell>
                  </TableRow>
               )
            })}
         </TableBody>
      </Table>
   )
}

export default FeeChargeTable
