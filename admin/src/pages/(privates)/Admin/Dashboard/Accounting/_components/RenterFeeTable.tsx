import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import type { TFeeTable } from './FeeChargeTable'
import { HiOutlineHome } from 'react-icons/hi2'
import {
   useAccountingPage,
   type TFeeChargeAccount,
   type TFeeStatus,
   type TFeeType,
} from '../_provider'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import CopyablePublicKey from '@/components/ui/copyable-public-key'

type TRenterFeeTable = {
   feeTx: string
   feeId: number
   ownerName: string
   paymentType: TFeeType
   amountDue: number
   dueDate: Date
   status: TFeeStatus
}

const RenterFeeTable = ({
   children,
   selectedFee,
}: {
   children: React.ReactNode
   selectedFee: TFeeTable | null
}) => {
   const {
      feeChargeAccount: { fees },
   } = useAccountingPage()

   const [renterFees, setRenterFees] = useState<TRenterFeeTable[]>([])

   useEffect(() => {
      if (selectedFee) {
         const mapped = fees
            .filter(
               (fee) =>
                  fee.data.toRenter.toBase58() ===
                  selectedFee.ownerPubkey?.toBase58(),
            )
            .map((fee: TFeeChargeAccount) => ({
               feeTx: fee.publicKey.toBase58(),
               feeId: fee.data.feeId,
               ownerName: selectedFee.ownerName,
               paymentType: fee.data.feeType,
               amountDue: fee.data.feeAmount,
               dueDate: new Date(fee.data.dueDate * 1000),
               status: fee.data.feeStatus,
            }))

         setRenterFees(mapped)
      }
   }, [selectedFee, fees])

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>

         <DialogContent>
            <DialogTitle>
               <span className="flex items-center gap-2 mb-4 pb-5 border-b">
                  <HiOutlineHome size={24} className="text-[#8956FF]" />
                  <h3 className="text-xl font-medium text-[#6F6F6F]">
                     {selectedFee?.ownerName}
                  </h3>
               </span>
            </DialogTitle>

            {/* Table */}
            <div className="mt-5">
               <Table className="border">
                  <TableHeader>
                     <TableRow className="bg-[#F3EEFF] dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                        <TableHead className="font-medium w-[15%] border">
                           TX
                        </TableHead>
                        <TableHead className="font-medium w-[15%] border">
                           Month
                        </TableHead>
                        <TableHead className="font-medium w-[15%] border">
                           Payment Type
                        </TableHead>
                        <TableHead className="font-medium w-[15%] border">
                           Amount
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {renterFees.map((fee: TRenterFeeTable, index) => {
                        return (
                           <TableRow key={index}>
                              <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                 <CopyablePublicKey
                                    publicKey={fee.feeTx}
                                    startChars={4}
                                    endChars={4}
                                 />
                              </TableCell>

                              <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                 {fee.dueDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric',
                                 })}
                              </TableCell>
                              <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                 {fee.paymentType}
                              </TableCell>
                              <TableCell
                                 className={cn(
                                    'transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700',
                                    {
                                       'text-red-500':
                                          fee.status === 'overdue' ||
                                          fee.status === 'unpaid',
                                       'text-black': fee.status === 'paid',
                                    },
                                 )}
                              >
                                 <span className="flex items-center gap-1">
                                    {fee.status === 'unpaid' && <p>-</p>}
                                    <p>${fee.amountDue.toFixed(2)}</p>
                                 </span>
                              </TableCell>
                           </TableRow>
                        )
                     })}
                  </TableBody>
               </Table>
            </div>
            <DialogClose className=" ml-auto">
               <Button className="bg-[#6938DA] text-white w-[100px] h-[40px] font-light text-[15px] rounded-full">
                  <IoCheckmarkOutline size={20} />
                  Done
               </Button>
            </DialogClose>
         </DialogContent>
      </Dialog>
   )
}
export default RenterFeeTable
