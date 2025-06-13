import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { FormProvider, useForm } from 'react-hook-form'
import InputField from '@/components/fields/InputField'
import { useState, useEffect } from 'react'
import {
   addRenterResolver,
   type TAddRenterPayload,
} from '@/domain/schemas/renter.schema'
import { Button } from '@/components/ui/button'
import { HiOutlineHome, HiOutlinePlusSmall } from 'react-icons/hi2'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { useAccountingPage } from '../_provider'
import generateWallet from '@/infrastructure/utils/generateWallet'

const AddRenterForm = ({ children }: { children: React.ReactNode }) => {
   const {
      renterAccount: { addRenterAsync },
   } = useAccountingPage()

   const [isDialogOpen, setIsDialogOpen] = useState(false)

   const form = useForm<TAddRenterPayload>({
      resolver: addRenterResolver,
   })

   const initNewWallet = async () => {
      const wallet = generateWallet()

      form.setValue('public_key', wallet.publicKey)
      form.setValue('secret_key', wallet.secretKey)
      form.setValue('private_key', wallet.privateKey)
      form.setValue('mnemonic', wallet.mnemonic)
   }

   const onSubmit = async (data: TAddRenterPayload) => {
      console.log('Form submitted with data:', data)

      addRenterAsync(data)

      form.reset()

      initNewWallet()
   }

   useEffect(() => {
      initNewWallet()
   }, [])

   return (
      <Dialog
         open={isDialogOpen}
         onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
               form.reset()
               initNewWallet()
            }
         }}
      >
         <DialogTrigger>{children}</DialogTrigger>

         <DialogContent className="!w-[600px] !max-w-[600px]">
            <DialogTitle className="flex items-center gap-2 mb-4 pb-5 border-b">
               <HiOutlineHome size={24} className="text-[#8956FF]" />
               <h3 className="text-xl font-medium text-[#6F6F6F]">
                  Add Renter
               </h3>
            </DialogTitle>

            <div className="mt-5">
               <FormProvider {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <InputField
                        form={form}
                        name="public_key"
                        label="Public Key"
                        description="Enter the name of the renter"
                        disabled={true}
                     />

                     <InputField
                        form={form}
                        name="renter_name"
                        label="Renter Name"
                        description="Enter the name of the renter"
                     />
                  </form>
               </FormProvider>
            </div>

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
         </DialogContent>
      </Dialog>
   )
}

export default AddRenterForm
