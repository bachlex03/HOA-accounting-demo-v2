import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type DatePickerFieldProps<T extends FieldValues> = {
   form: UseFormReturn<T>
   name: Path<T>
   label: string
   description?: string
   className?: string
   disabled?: boolean
}

const DatePickerField = <T extends FieldValues>({
   form,
   name,
   label,
   description,
   className,
   disabled,
}: DatePickerFieldProps<T>) => {
   return (
      <FormField
         control={form.control}
         name={name}
         render={({ field }) => (
            <FormItem className="flex flex-col">
               <FormLabel className="">{label}</FormLabel>

               <Popover>
                  <PopoverTrigger>
                     <FormControl>
                        <Button
                           variant={'outline'}
                           className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                           )}
                        >
                           {field.value ? (
                              format(field.value, 'PPP')
                           ) : (
                              <span>Pick a date</span>
                           )}
                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                     </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date('1900-01-01')}
                        captionLayout="dropdown"
                     />
                  </PopoverContent>
               </Popover>

               {/* <Popover>
                  <PopoverTrigger asChild>
                     <FormControl>
                        <Button
                           variant={'outline'}
                           className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                           )}
                        >
                           {field.value ? (
                              format(field.value, 'PPP')
                           ) : (
                              <span>Pick a date</span>
                           )}
                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                     </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                           date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                     />
                  </PopoverContent>
               </Popover> */}

               {description && (
                  <FormDescription className={cn('')}>
                     {description}
                  </FormDescription>
               )}

               <FormMessage className="!mt-0" />
            </FormItem>
         )}
      />
   )
}

export default DatePickerField
