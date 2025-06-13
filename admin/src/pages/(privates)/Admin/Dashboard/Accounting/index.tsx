import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { HandCoins } from 'lucide-react'
import { LiaBalanceScaleRightSolid } from 'react-icons/lia'
import { CiCreditCardOff, CiBookmark } from 'react-icons/ci'
import { CiFilter, CiSearch } from 'react-icons/ci'
import { Button } from '@/components/ui/button'
import RenterTable from './_components/RenterTable'
import FeeChargeTable from './_components/FeeChargeTable'
import { AccountingProvider } from './_provider'
import AddRenterForm from './_components/AddRenterForm'

const AccountingPage = () => {
   return (
      <AccountingProvider>
         <div>
            <div className="grid grid-cols-4 gap-10">
               <div className="bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <LiaBalanceScaleRightSolid className="text-[80px]" />
                  <p className="text-3xl font-bold font-mono">$12,564</p>
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-xl font-semibold">Current Balance</p>
                     <p className="text-xs text-[#471EA7]">Balance Sheet</p>
                  </div>
               </div>
               <div className="bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <CiCreditCardOff className="text-[80px]" />
                  <p className="text-3xl font-bold font-mono">$864</p>
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-xl font-semibold">Overdue Payments</p>
                     <p className="text-xs text-[#471EA7]">5 Payments</p>
                  </div>
               </div>
               <div className="col-span-2 flex gap-4 flex-col">
                  <Select>
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Current year" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="light">2025</SelectItem>
                        <SelectItem value="dark">2024</SelectItem>
                        <SelectItem value="system">2023</SelectItem>
                     </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <HandCoins size={80} />
                        <p className="text-3xl font-bold font-mono">$25,234</p>
                        <div className="flex flex-col items-center gap-2">
                           <p className="text-xl font-semibold">Income</p>
                        </div>
                     </div>
                     <div className="bg-[#f3eeff] p-4 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <CiBookmark className="text-[80px]" />
                        <p className="text-3xl font-bold font-mono">$8,543</p>
                        <div className="flex flex-col items-center gap-2">
                           <p className="text-xl font-semibold">Expense</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <Separator className="mt-10 mb-5" />

            <div className="flex justify-between items-center mb-5">
               <span></span>

               <div className="flex gap-3">
                  <RenterTable>
                     <Button className="bg-[#6938DA] text-white text-[15px] h-[40px] w-[150px] hover:bg-[#8956FF] cursor-pointer font-semibold">
                        Renter list
                     </Button>
                  </RenterTable>
                  <AddRenterForm>
                     <Button className="bg-[#6938DA] text-white text-[15px] rounded-full h-[40px] w-[150px] hover:bg-[#8956FF] cursor-pointer font-semibold">
                        Create Renter
                     </Button>
                  </AddRenterForm>
                  {/* <RenterForm>
               </RenterForm> */}
               </div>
            </div>

            <div>
               <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                     <Select>
                        <SelectTrigger className="w-[250px]">
                           <SelectValue placeholder="December 2024" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="light">2025</SelectItem>
                           <SelectItem value="dark">2024</SelectItem>
                           <SelectItem value="system">2023</SelectItem>
                        </SelectContent>
                     </Select>
                     <p className="w-md">3 overdue payments</p>
                  </div>

                  <div className="flex gap-3 items-center">
                     <div className="relative">
                        <CiSearch
                           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                           size={20}
                        />
                        <Input
                           type="text"
                           placeholder="Search"
                           className="pl-10 w-[300px] border-[#BEA2FF] focus:border-[#471EA7] focus:ring-[#471EA7]"
                        />
                     </div>
                     <p className="p-3 rounded-full border border-[#BEA2FF]">
                        <CiFilter size={20} className="text-[#BEA2FF]" />
                     </p>
                  </div>
               </div>
            </div>

            {/* Table */}
            <div className="mt-5">
               <FeeChargeTable />
            </div>
         </div>
      </AccountingProvider>
   )
}

export default AccountingPage
