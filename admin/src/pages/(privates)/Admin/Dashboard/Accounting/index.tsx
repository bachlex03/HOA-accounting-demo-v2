import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { HandCoins } from 'lucide-react'
import { LiaBalanceScaleRightSolid } from 'react-icons/lia'
import { CiCreditCardOff, CiBookmark } from 'react-icons/ci'
import { PiDotsThreeOutlineVertical } from 'react-icons/pi'
import { CiFilter, CiSearch } from 'react-icons/ci'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
            <p className='text-xl font-semibold'>Current Balance</p>
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
                    <Link to={'/'}>
                      <Button variant={'ghost'}>
                        <PiDotsThreeOutlineVertical size={20} />
                      </Button>
                    </Link>
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
