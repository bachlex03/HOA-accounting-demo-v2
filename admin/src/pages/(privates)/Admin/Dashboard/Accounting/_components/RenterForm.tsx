import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { HiOutlineHome } from 'react-icons/hi2'
import { IoCheckmarkOutline } from 'react-icons/io5'
import { FormProvider, useForm } from 'react-hook-form'
import {
   addRenterResolver,
   type TAddRenterPayload,
} from '@/domain/schemas/renter.schema'
import InputField from '@/components/ui/InputField'
import useRenter from '@/hooks/use-renter'
import { HiOutlinePlusSmall } from 'react-icons/hi2'

const RenterForm = ({ children }: { children?: React.ReactNode }) => {
   const { initializeRenter } = useRenter()

   const form = useForm<TAddRenterPayload>({
      resolver: addRenterResolver,
   })

   const onSubmit = (data: TAddRenterPayload) => {
      console.log('Form submitted with data:', data)
      // Here you would typically call a function to handle the form submission,
      // such as sending the data to an API or updating the state.

      initializeRenter(data)
   }

   return (
      <Dialog>
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
                        label="Renter Public Key"
                        description="Enter the public key of the renter"
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

export default RenterForm
