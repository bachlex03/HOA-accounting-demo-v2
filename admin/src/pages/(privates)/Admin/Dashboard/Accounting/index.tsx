import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { HandCoins } from 'lucide-react'
import { LiaBalanceScaleRightSolid } from 'react-icons/lia'
import { CiCreditCardOff, CiBookmark } from 'react-icons/ci'
import { PiDotsThreeOutlineVertical } from 'react-icons/pi'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { HiOutlineHome } from 'react-icons/hi2'
import { CiFilter, CiSearch } from 'react-icons/ci'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import useAccounting from '@/hooks/use-accounting'

const statusConfig = {
  PAID: {
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  UNPAID: {
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  OVERDUE: {
    color: 'bg-red-50 text-red-700 border-red-200'
  }
}

const AccountingPage = () => {
  const { feeCharges } = useAccounting()

  console.log('[AccountingPage] feeCharges:', feeCharges)

  return (
    <div>
      <div className='grid grid-cols-4 gap-10'>
        <div className='bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3'>
          <LiaBalanceScaleRightSolid className='text-[80px]' />
          <p className='text-3xl font-bold font-mono'>$12,564</p>
          <div className='flex flex-col items-center gap-2'>
            <p className='text-xl font-semibold'>Current Balance</p>
            <p className='text-xs text-[#471EA7]'>Balance Sheet</p>
          </div>
        </div>
        <div className='bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3'>
          <CiCreditCardOff className='text-[80px]' />
          <p className='text-3xl font-bold font-mono'>$864</p>
          <div className='flex flex-col items-center gap-2'>
            <p className='text-xl font-semibold'>Overdue Payments</p>
            <p className='text-xs text-[#471EA7]'>5 Payments</p>
          </div>
        </div>
        <div className='col-span-2 flex gap-4 flex-col'>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Current year' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>2025</SelectItem>
              <SelectItem value='dark'>2024</SelectItem>
              <SelectItem value='system'>2023</SelectItem>
            </SelectContent>
          </Select>

          <div className='grid grid-cols-2 gap-10'>
            <div className='bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3'>
              <HandCoins size={80} />
              <p className='text-3xl font-bold font-mono'>$25,234</p>
              <div className='flex flex-col items-center gap-2'>
                <p className='text-xl font-semibold'>Income</p>
              </div>
            </div>
            <div className='bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3'>
              <CiBookmark className='text-[80px]' />
              <p className='text-3xl font-bold font-mono'>$8,543</p>
              <div className='flex flex-col items-center gap-2'>
                <p className='text-xl font-semibold'>Expense</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className='my-10' />

      <div>
        <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <Select>
              <SelectTrigger className='w-[250px]'>
                <SelectValue placeholder='December 2024' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='light'>2025</SelectItem>
                <SelectItem value='dark'>2024</SelectItem>
                <SelectItem value='system'>2023</SelectItem>
              </SelectContent>
            </Select>
            <p className='w-md'>3 overdue payments</p>
          </div>
          <div className='flex gap-3 items-center'>
            <div className='relative'>
              <CiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
              <Input
                type='text'
                placeholder='Search'
                className='pl-10 w-[300px] border-[#BEA2FF] focus:border-[#471EA7] focus:ring-[#471EA7]'
              />
            </div>
            <p className='p-3 rounded-full border border-[#BEA2FF]'>
              <CiFilter size={20} className='text-[#BEA2FF]' />
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='mt-5'>
        <Table className='border'>
          <TableHeader>
            <TableRow className='bg-[#F3EEFF] dark:bg-slate-800/50 dark:hover:bg-slate-800/50'>
              <TableHead className='font-medium w-[15%]'>Property Address</TableHead>
              <TableHead className='font-medium w-[25%]'>Owner</TableHead>
              <TableHead className='font-medium w-[15%]'>Payment Type</TableHead>
              <TableHead className='font-medium w-[15%]'>Amount Due</TableHead>
              <TableHead className='font-medium w-[15%]'>Due Date</TableHead>
              <TableHead className='font-medium w-[10%]'>Status</TableHead>
              <TableHead className='text-right font-medium w-[5%]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    123 Abbey Rd., Unit 2
                  </TableCell>

                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    Roger Rosser
                  </TableCell>

                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    Monthly
                  </TableCell>

                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    $124
                  </TableCell>

                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    30 jan, 2025
                  </TableCell>

                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    <Badge
                      className={cn(
                        'border select-none text-xs font-medium flex items-center gap-1.5 py-1 px-2 mr-5 rounded-lg hover:bg-white',
                        `${statusConfig.UNPAID.color}`
                      )}
                    >
                      Unpaid
                    </Badge>
                  </TableCell>

                  <TableCell className='transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                    <Dialog>
                      <DialogTrigger>
                        <Button variant={'ghost'}>
                          <PiDotsThreeOutlineVertical size={20} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='!w-[600px] !max-w-[600px]'>
                        <div>
                          <span className='flex items-center gap-2 mb-4 pb-5 border-b'>
                            <HiOutlineHome size={24} className='text-[#8956FF]' />
                            <h3 className='text-xl font-medium text-[#6F6F6F]'>Roger Rosser</h3>
                          </span>

                          <div className='flex flex-col gap-5'>
                            <div className='flex items-center gap-5'>
                              <span className='flex gap-2'>
                                <LiaBalanceScaleRightSolid className='text-[24px] text-[#8956FF]' />

                                <p className='text-[15px] text-[#6F6F6F] font-medium min-w-[130px]'>Current Balance</p>
                              </span>

                              <p className='text-[15px] font-medium'>-$124</p>
                            </div>

                            <div className='flex items-center gap-5'>
                              <span className='flex gap-2'>
                                <LiaBalanceScaleRightSolid className='text-[24px] text-[#8956FF]' />

                                <p className='text-[15px] text-[#6F6F6F] font-medium min-w-[130px]'>Open Charges</p>
                              </span>

                              <p className='text-[15px] font-medium'>-$124</p>
                            </div>

                            <div className='flex items-center justify-between gap-5'>
                              <span className='flex gap-2'>
                                <LiaBalanceScaleRightSolid className='text-[24px] text-[#8956FF]' />

                                <p className='text-[15px] text-[#6F6F6F] font-medium'>Payment History</p>
                              </span>

                              <div className='flex items-center'>
                                <Select>
                                  <SelectTrigger className='w-[150px]'>
                                    <SelectValue placeholder='All' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='light'>All</SelectItem>
                                    <SelectItem value='dark'>Late payments</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Table */}
                          <div className='mt-5'>
                            <Table className='border'>
                              <TableHeader>
                                <TableRow className='bg-[#F3EEFF] dark:bg-slate-800/50 dark:hover:bg-slate-800/50'>
                                  <TableHead className='font-medium w-[15%] border'>Month</TableHead>
                                  <TableHead className='font-medium w-[15%] border'>Payment Type</TableHead>
                                  <TableHead className='font-medium w-[15%] border'>Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Array.from({ length: 5 }).map((_, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell className='transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                                        January 2025
                                      </TableCell>
                                      <TableCell className='transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700'>
                                        Monthly
                                      </TableCell>
                                      <TableCell
                                        className={cn(
                                          'transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700',
                                          {
                                            'text-red-500': index % 2 !== 0
                                          }
                                        )}
                                      >
                                        {index % 2 === 0 ? <p>$124</p> : <p>-$124</p>}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>

                          <div className='flex mt-5'>
                            <p className='text-sm text-[#6F6F6F]'>Page 1 of 3</p>
                          </div>

                          <div className='flex items-center mt-2'>
                            <p className='text-sm text-[#6F6F6F]'>Home Owner ID: 4567890</p>

                            <Button className='bg-[#6938DA] text-white ml-auto w-[100px] h-[40px] font-light text-[15px] rounded-full'>
                              <IoCheckmarkOutline size={20} />
                              Done
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AccountingPage
