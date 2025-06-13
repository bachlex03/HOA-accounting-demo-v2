import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
   type UseFormReturn,
   type Path,
   type FieldValues,
   type ArrayPath,
} from 'react-hook-form'

export type TOption = {
   value: string
   label: string
   icon?: React.ComponentType<{ className?: string }>
}

type SelectFieldProps<T extends FieldValues> = {
   form: UseFormReturn<T>
   name: Path<T> | ArrayPath<T>
   label: string
   optionsData: TOption[]
   description?: string
   className?: string
   placeholder?: string
   disabled?: boolean
   defaultValue?: string
   onChange?: (value: string) => void
   onRenderOptions?: () => React.ReactNode
}

const SelectField = <T extends FieldValues>({
   form,
   name,
   optionsData,
   label,
   description,
   className = '',
   placeholder = '',
   disabled = false,
   defaultValue,
   onRenderOptions,
   onChange,
}: SelectFieldProps<T>) => {
   const renderOptions = () => {
      if (onRenderOptions) {
         return onRenderOptions()
      }

      return optionsData.length > 0 ? (
         optionsData.map((item, index) => {
            return (
               <SelectItem key={index} value={item.value}>
                  {item.label}
               </SelectItem>
            )
         })
      ) : (
         <p className="ml-3 text-sm">Empty item</p>
      )
   }

   return (
      <div className={cn('pb-2', className)}>
         <FormField
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="">{label}</FormLabel>

                  <Select
                     onValueChange={(value) => {
                        field.onChange(value)
                        if (onChange) {
                           onChange(value)
                        }
                     }}
                     defaultValue={defaultValue || field.value}
                     disabled={disabled}
                  >
                     <FormControl>
                        <SelectTrigger className="w-full">
                           <SelectValue
                              className="w-full"
                              placeholder={
                                 placeholder ??
                                 'Select a verified email to display'
                              }
                              defaultValue={field.value}
                           />
                        </SelectTrigger>
                     </FormControl>
                     <SelectContent className="w-full">
                        {renderOptions()}
                     </SelectContent>
                  </Select>

                  {description && (
                     <FormDescription className={cn('')}>
                        {description}
                     </FormDescription>
                  )}

                  <FormMessage className="!mt-0" />
               </FormItem>
            )}
         />
      </div>
   )
}

export default SelectField
