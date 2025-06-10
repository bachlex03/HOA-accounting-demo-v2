import DatePickerField from '@/components/fields/DatePickerField'
import InputField from '@/components/fields/InputField'
import SelectField, { type OptionType } from '@/components/fields/SelectField'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import {
   addFeeChargeResolver,
   type TAddFeeChargePayload,
} from '@/domain/schemas/fee.schema'
import useAccounting from '@/hooks/use-accounting'
import type { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { HiOutlineHome, HiOutlinePlusSmall } from 'react-icons/hi2'
import { IoCheckmarkOutline } from 'react-icons/io5'

const feeTypeOptions: OptionType[] = [
   {
      value: 'Monthly',
      label: 'Monthly',
   },
   {
      value: 'Special',
      label: 'Special',
   },
]

const AddFeeForm = ({
   children,
   selectedRenter,
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
}) => {
   const { addFeeCharge, isLoading, isSuccessAddFee } = useAccounting()
   const [isDialogOpen, setIsDialogOpen] = useState(false)

   console.log('isLoading', isLoading)

   const form = useForm<TAddFeeChargePayload>({
      resolver: addFeeChargeResolver,
   })

   useEffect(() => {
      if (selectedRenter) {
         form.setValue('public_key', selectedRenter.account.owner)
         form.setValue('next_fee_id', selectedRenter.account.nextFeeId)
      }
   }, [selectedRenter])

   useEffect(() => {
      if (isSuccessAddFee) {
         setIsDialogOpen(false)
         form.reset()
      }
   }, [isSuccessAddFee, form])

   const onSubmit = (data: TAddFeeChargePayload) => {
      addFeeCharge(data)
   }

   return (
      <div>
         <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
               setIsDialogOpen(open)
               if (!open) {
                  form.reset()
               }
            }}
         >
            <LoadingOverlay isLoading={isLoading} fullScreen={true} />
            <DialogTrigger onClick={() => setIsDialogOpen(true)}>
               {children}
            </DialogTrigger>
            <DialogContent className="!w-[600px] !max-w-[600px]">
               <div>
                  <span className="flex items-center gap-2 mb-4 pb-5 border-b">
                     <HiOutlineHome size={24} className="text-[#8956FF]" />
                     <DialogTitle>
                        <h3 className="text-xl font-medium text-[#6F6F6F]">
                           {selectedRenter?.account.renterName}
                        </h3>
                     </DialogTitle>
                  </span>
               </div>

               <div>
                  <FormProvider {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)}>
                        <InputField
                           form={form}
                           name="public_key"
                           label="Public Key"
                           disabled={true}
                        />

                        <SelectField
                           form={form}
                           name="fee_type"
                           label="Fee Type"
                           description="Select the type of fee to charge"
                           optionsData={feeTypeOptions}
                        />

                        <InputField
                           form={form}
                           type="currency"
                           name="amount"
                           label="Amount"
                           description="Enter the amount to charge"
                        />

                        <DatePickerField
                           form={form}
                           name="due_date"
                           label="Due Date"
                           description="Select the due date for the fee"
                        />
                     </form>
                  </FormProvider>

                  <div className="flex items-center mt-2">
                     <DialogClose className="">
                        <Button className="bg-[#6938DA] text-white w-[100px] h-[40px] font-light text-[15px] rounded-full">
                           <IoCheckmarkOutline size={20} />
                           Close
                        </Button>
                     </DialogClose>

                     <Button
                        className="bg-[#6938DA] text-white w-[100px] h-[40px] font-light text-[15px] rounded-full ml-auto"
                        onClick={() => form.handleSubmit(onSubmit)()}
                     >
                        <HiOutlinePlusSmall size={20} />
                        Add
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   )
}

export default AddFeeForm
