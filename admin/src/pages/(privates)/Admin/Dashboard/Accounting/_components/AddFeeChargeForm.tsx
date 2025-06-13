import { LoadingOverlay } from '@/components/customs/LoadingOverlay'
import type { TRenterTable } from './RenterTable'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import DatePickerField from '@/components/fields/DatePickerField'
import InputField from '@/components/fields/InputField'
import SelectField, { type TOption } from '@/components/fields/SelectField'
import { FormProvider, useForm } from 'react-hook-form'
import {
   addFeeChargeResolver,
   type TAddFeeChargePayload,
} from '@/domain/schemas/fee.schema'
import { Button } from '@/components/ui/button'
import { HiOutlineHome, HiOutlinePlusSmall } from 'react-icons/hi2'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { useAccountingPage } from '../_provider'

const feeTypeOptions: TOption[] = [
   {
      value: 'Monthly',
      label: 'Monthly',
   },
   {
      value: 'Special',
      label: 'Special',
   },
]

const AddFeeChargeForm = ({
   children,
   selectedRenter,
}: {
   children: React.ReactNode
   selectedRenter: TRenterTable | null
}) => {
   const [isDialogOpen, setIsDialogOpen] = useState(false)
   const {
      feeChargeAccount: { addFeeChargeAsync, isFetching },
   } = useAccountingPage()

   const form = useForm<TAddFeeChargePayload>({
      resolver: addFeeChargeResolver,
   })

   const onSubmit = (data: TAddFeeChargePayload) => {
      console.log('data', data)
      addFeeChargeAsync(data)
   }

   useEffect(() => {
      if (selectedRenter) {
         console.log(
            'selectedRenter.renterPubkey',
            selectedRenter.renterPubkey.toBase58(),
         )

         form.setValue('public_key', selectedRenter.renterPubkey)
         form.setValue('next_fee_id', selectedRenter.nextFeeId)
      }
   }, [selectedRenter])

   return (
      <Dialog
         open={isDialogOpen}
         onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
               form.reset()
            }
         }}
      >
         <LoadingOverlay isLoading={false} fullScreen={true} />
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent className="!w-[700px] !max-w-[700px]">
            <div>
               <span className="flex items-center gap-2 mb-4 pb-5 border-b">
                  <HiOutlineHome size={24} className="text-[#8956FF]" />
                  <DialogTitle>
                     <h3 className="text-xl font-medium text-[#6F6F6F]">
                        {selectedRenter?.renterName}
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
                        disabled={isFetching}
                        name="fee_type"
                        label="Fee Type"
                        description="Select the type of fee to charge"
                        optionsData={feeTypeOptions}
                     />

                     <InputField
                        form={form}
                        disabled={isFetching}
                        type="currency"
                        name="amount"
                        label="Amount"
                        description="Enter the amount to charge"
                     />

                     <DatePickerField
                        disabled={isFetching}
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
                     className="bg-[#6938DA] text-white min-w-[100px] h-[40px] font-light text-[15px] rounded-full ml-auto"
                     disabled={isFetching}
                     onClick={() => form.handleSubmit(onSubmit)()}
                  >
                     <HiOutlinePlusSmall size={20} />
                     {isFetching ? 'Processing...' : 'Add'}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   )
}

export default AddFeeChargeForm
