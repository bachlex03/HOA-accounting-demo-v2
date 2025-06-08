import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { IoCheckmarkOutline } from 'react-icons/io5';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { HiOutlineHome } from 'react-icons/hi2';
import useRenter from '@/hooks/use-renter';
import CopyablePublicKey from '@/components/ui/copyable-public-key';

const RenterList = ({ children }: { children?: React.ReactNode }) => {
   const { renters } = useRenter();

   console.log('Renters:', renters);
   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>

         <DialogContent className="!w-[600px] !max-w-[600px]">
            <DialogTitle className="flex items-center gap-2 mb-4 pb-5 border-b">
               <HiOutlineHome size={24} className="text-[#8956FF]" />
               <h3 className="text-xl font-medium text-[#6F6F6F]">
                  Renter List
               </h3>
            </DialogTitle>

            {/* Table */}
            <div className="mt-5">
               <Table className="border">
                  <TableHeader>
                     <TableRow className="bg-[#F3EEFF] dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                        <TableHead className="font-medium w-[30%] border">
                           Public key
                        </TableHead>
                        <TableHead className="font-medium w-[30%] border">
                           Transaction
                        </TableHead>
                        <TableHead className="font-medium border">
                           Renter name
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {renters.map((renter, index) => {
                        return (
                           <TableRow key={index}>
                              <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                 <CopyablePublicKey
                                    publicKey={renter.account.owner.toBase58()}
                                    startChars={4}
                                    endChars={4}
                                 />
                              </TableCell>
                              <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                 <CopyablePublicKey
                                    publicKey={renter.publicKey.toBase58()}
                                    startChars={4}
                                    endChars={4}
                                 />
                              </TableCell>
                              <TableCell className="transition-all text-sm font-light hover:bg-slate-50 dark:hover:bg-slate-800/50 animate-fadeIn border border-slate-200 dark:border-slate-700">
                                 {renter.account.renterName}
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </div>

            <div className="flex mt-5">
               <p className="text-sm text-[#6F6F6F]">Page 1 of 3</p>
            </div>

            <div className="flex items-center mt-2">
               <p className="text-sm text-[#6F6F6F]">Home Owner ID: 4567890</p>

               <DialogClose className=" ml-auto">
                  <Button className="bg-[#6938DA] text-white w-[100px] h-[40px] font-light text-[15px] rounded-full">
                     <IoCheckmarkOutline size={20} />
                     Done
                  </Button>
               </DialogClose>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default RenterList;
