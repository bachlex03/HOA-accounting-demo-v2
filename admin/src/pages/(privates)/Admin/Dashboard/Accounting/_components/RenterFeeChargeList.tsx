import useAccounting from '@/hooks/use-accounting'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PiDotsThreeOutlineVertical } from 'react-icons/pi'
import { HiOutlineHome } from 'react-icons/hi2'
import { LiaBalanceScaleRightSolid } from 'react-icons/lia'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { IoCheckmarkOutline } from 'react-icons/io5'
import type { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

const statusConfig = {
   PAID: '',
   UNPAID: '',
   OVERDUE: '',
}

type TFeeType = {
   publicKey: PublicKey
   account: {
      feeId: number
      amount: number
      feeType: string
      status: string
      dueDate: Date
   }
}

const RenterFeeChargeList = ({
   children,
   selectedRenter,
   disabled = false,
}: {
   children: React.ReactNode
   selectedRenter: {
      publicKey: PublicKey
      account: {
         renterName: string
         owner: PublicKey
         nextFeeId: number
      }
   } | null
   disabled?: boolean
}) => {
   const [renter, setRenter] = useState<{
      publicKey: PublicKey
      account: {
         renterName: string
         owner: PublicKey
         nextFeeId: number
      }
   } | null>(null)
   const [fees, setFees] = useState<any[]>([])

   const { getFeesOfRenter } = useAccounting()

   // const feesOffRenter = getFeesOfRenter()
   useEffect(() => {
      const getFees = async () => {
         if (selectedRenter) {
            const fees = await getFeesOfRenter(selectedRenter.account.owner)

            if (fees) {
               const TFeesType = fees.map((fee) => {
                  const feeId = fee.account.feeId.toNumber()
                  const amount = fee.account.amount.toNumber()
                  const dueDate = new Date(
                     fee.account.dueDate.toNumber() * 1000,
                  )
                  const feeType = Object.keys(
                     fee.account.feeType,
                  )[0].toUpperCase()
                  const feeStatus = Object.keys(
                     fee.account.status,
                  )[0].toUpperCase()

                  return {
                     publicKey: fee.publicKey,
                     account: {
                        feeId: feeId,
                        amount: amount,
                        feeType: feeType,
                        status: feeStatus,
                        dueDate: dueDate,
                     },
                  }
               })

               console.log('TFeesType', TFeesType)
               setFees(TFeesType)
            } else {
               setFees([])
            }
         }
      }
      getFees()
   }, [selectedRenter])

   return (
      <Dialog>
         <DialogTrigger disabled={disabled}>{children}</DialogTrigger>
         <DialogContent className="!w-[600px] !max-w-[600px]">
            <div>
               <span className="flex items-center gap-2 mb-4 pb-5 border-b">
                  <HiOutlineHome size={24} className="text-[#8956FF]" />
                  <h3 className="text-xl font-medium text-[#6F6F6F]">
                     {selectedRenter?.account.renterName}
                  </h3>
               </span>

               <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-5">
                     <span className="flex gap-2">
                        <LiaBalanceScaleRightSolid className="text-[24px] text-[#8956FF]" />

                        <p className="text-[15px] text-[#6F6F6F] font-medium min-w-[130px]">
                           Current Balance
                        </p>
                     </span>

                     <p className="text-[15px] font-medium">-$124</p>
                  </div>

                  <div className="flex items-center gap-5">
                     <span className="flex gap-2">
                        <LiaBalanceScaleRightSolid className="text-[24px] text-[#8956FF]" />

                        <p className="text-[15px] text-[#6F6F6F] font-medium min-w-[130px]">
                           Open Charges
                        </p>
                     </span>

                     <p className="text-[15px] font-medium">-$124</p>
                  </div>

                  <div className="flex items-center justify-between gap-5">
                     <span className="flex gap-2">
                        <LiaBalanceScaleRightSolid className="text-[24px] text-[#8956FF]" />

                        <p className="text-[15px] text-[#6F6F6F] font-medium">
                           Payment History
                        </p>
                     </span>

                     <div className="flex items-center">
                        <Select>
                           <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="All" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="light">All</SelectItem>
                              <SelectItem value="dark">
                                 Late payments
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>

               {/* Table */}
               <div className="mt-5">
                  <Table className="border">
                     <TableHeader>
                        <TableRow className="bg-[#F3EEFF] dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
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
                        {fees.map((fee: TFeeType, index) => {
                           return (
                              <TableRow key={index}>
                                 <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                    {fee.account.dueDate.toLocaleDateString(
                                       'en-US',
                                       {
                                          month: 'short',
                                          year: 'numeric',
                                       },
                                    )}
                                 </TableCell>
                                 <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                    {fee.account.feeType}
                                 </TableCell>
                                 <TableCell
                                    className={cn(
                                       'transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700',
                                       {
                                          'text-red-500':
                                             fee.account.status === 'OVERDUE' ||
                                             fee.account.status === 'UNPAID',
                                          'text-green-500':
                                             fee.account.status === 'PAID',
                                       },
                                    )}
                                 >
                                    <span className="flex items-center gap-1">
                                       {fee.account.status === 'UNPAID' && (
                                          <p>-</p>
                                       )}
                                       <p>${fee.account.amount.toFixed(2)}</p>
                                    </span>
                                 </TableCell>
                              </TableRow>
                           )
                        })}
                     </TableBody>
                  </Table>
               </div>

               <div className="flex mt-5">
                  <p className="text-sm text-[#6F6F6F]">Page 1 of 3</p>
               </div>

               <div className="flex items-center mt-2">
                  <p className="text-sm text-[#6F6F6F]">
                     Home Owner ID: 4567890
                  </p>

                  <DialogClose className=" ml-auto">
                     <Button className="bg-[#6938DA] text-white w-[100px] h-[40px] font-light text-[15px] rounded-full">
                        <IoCheckmarkOutline size={20} />
                        Done
                     </Button>
                  </DialogClose>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   )
}

export default RenterFeeChargeList
