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
import InputField from '@/components/fields/InputField'
import useRenter from '@/hooks/use-renter'
import { HiOutlinePlusSmall } from 'react-icons/hi2'
import * as bs58 from 'bs58'
import * as bip39 from 'bip39'
import { useEffect } from 'react'
import { Keypair } from '@solana/web3.js'
import { HDKey } from 'micro-ed25519-hdkey'
import { LoadingOverlay } from '@/components/LoadingOverlay'

const RenterForm = ({ children }: { children?: React.ReactNode }) => {
   const { initializeRenter, isLoading, refetch } = useRenter()

   const form = useForm<TAddRenterPayload>({
      resolver: addRenterResolver,
   })

   const generateKeys = async () => {
      const mnemonic = bip39.generateMnemonic()
      console.log('[LOG:VAR]::mnemonic: ', mnemonic)
      const seed = bip39.mnemonicToSeedSync(mnemonic, '')
      console.log('[LOG:VAR]::seed: ', seed)
      // derive HD key from seed
      const hdKey = HDKey.fromMasterSeed(seed.toString('hex'))
      // derive keypair from HD key and specified path
      const keypair = Keypair.fromSeed(
         hdKey.derive(`m/44'/501'/0'/0'`).privateKey,
      )
      console.log(
         '[LOG:VAR]::keypair.publicKey: ',
         keypair.publicKey.toBase58(),
      )
      console.log('[LOG:VAR]::keypair.secretKey: ', keypair.secretKey)
      console.log(
         '[LOG:VAR]::keypair.secretKey: ',
         keypair.secretKey.toString(),
      )
      const privateKeyBase58 = bs58.default.encode(keypair.secretKey) // Convert to base58
      console.log('[LOG:VAR]::privateKeyBase58: ', privateKeyBase58)

      // Prepare wallet data
      const walletData = {
         timestamp: new Date().toISOString(),
         mnemonic: mnemonic,
         seed: seed.toString('hex'),
         publicKey: keypair.publicKey.toBase58(),
         privateKey: privateKeyBase58,
         secretKey: Array.from(keypair.secretKey),
         derivationPath: "m/44'/501'/0'/0'",
      }

      console.log('walletData', walletData)

      form.setValue('public_key', keypair.publicKey)
      form.setValue('secret_key', Array.from(keypair.secretKey))
      form.setValue('private_key', privateKeyBase58)
      form.setValue('mnemonic', mnemonic)
   }

   const onSubmit = async (data: TAddRenterPayload) => {
      console.log('Form submitted with data:', data)

      await initializeRenter(data)

      // refetch()
      form.reset()
      generateKeys()
   }

   useEffect(() => {
      generateKeys()
   }, [])
   return (
      <Dialog>
         <LoadingOverlay isLoading={isLoading} fullScreen />
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

export default RenterForm
