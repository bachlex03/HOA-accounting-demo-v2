import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import {
   type UseFormReturn,
   type Path,
   type FieldValues,
   type ArrayPath,
   type ControllerRenderProps,
} from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type InputFieldProps<T extends FieldValues> = {
   form: UseFormReturn<T>
   name: Path<T> | ArrayPath<T>
   label: string
   type?:
      | 'text'
      | 'email'
      | 'password'
      | 'number'
      | 'percentage'
      | 'color'
      | 'url'
      | 'textarea'
      | 'currency'
   description?: string
   className?: string
   disabled?: boolean
   onChange?: (value: string | number) => void
}

function InputField<T extends FieldValues>({
   form,
   name,
   label,
   type = 'text',
   description,
   className = '',
   disabled = false,
   onChange,
}: InputFieldProps<T>) {
   const renderInput = (field: ControllerRenderProps<T, Path<T>>) => {
      switch (type) {
         case 'textarea':
            return (
               <Textarea
                  {...field}
                  value={field.value || ''}
                  disabled={disabled}
                  onChange={(e) => {
                     const value = e.target.value
                     field.onChange(value)
                     if (onChange) {
                        onChange(value)
                     }
                  }}
               />
            )
         case 'number':
            return (
               <Input
                  type="number"
                  {...field}
                  value={Number(field.value)}
                  disabled={disabled}
                  onChange={(e) => {
                     const value = e.target.value
                     field.onChange(value)
                     if (onChange) {
                        onChange(value)
                     }
                  }}
               />
            )
         case 'currency':
            return (
               <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                     $
                  </span>
                  <Input
                     type="number"
                     {...field}
                     value={field.value || ''}
                     disabled={disabled}
                     className="pl-8"
                     step="0.01"
                     min="0"
                     placeholder="0.00"
                     onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        field.onChange(value)
                        if (onChange) {
                           onChange(value)
                        }
                     }}
                     //  onBlur={() => {
                     //     const value = Number(field.value).toFixed(2)
                     //     field.onChange(parseFloat(value))
                     //  }}
                  />
               </div>
            )
         case 'percentage':
            return (
               <Input
                  type="text"
                  {...field}
                  value={
                     field.value
                        ? `${Math.min(100, Math.max(0, Number(field.value) * 100))}%`
                        : '0%'
                  }
                  disabled={disabled}
                  onChange={(e) => {
                     const value = e.target.value.replace(/%/g, '')
                     let numValue = parseFloat(value)

                     if (!isNaN(numValue)) {
                        numValue = Math.min(100, Math.max(0, numValue))

                        const decimalValue = numValue / 100

                        field.onChange(decimalValue)

                        if (onChange) {
                           onChange(decimalValue)
                        }
                     } else {
                        field.onChange(0)

                        if (onChange) {
                           onChange(0)
                        }
                     }
                  }}
               />
            )
         case 'password':
            return (
               <Input
                  type="password"
                  {...field}
                  value={field.value || ''}
                  disabled={disabled}
                  onChange={(e) => {
                     const value = e.target.value
                     field.onChange(value)
                     if (onChange) {
                        onChange(value)
                     }
                  }}
               />
            )
         default:
            return (
               <Input
                  type="text"
                  {...field}
                  value={field.value || ''}
                  disabled={disabled}
                  onChange={(e) => {
                     const value = e.target.value
                     field.onChange(value)
                     if (onChange) {
                        onChange(value)
                     }
                  }}
               />
            )
      }
   }
   return (
      <div className={cn('pb-2', className)}>
         <FormField
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="">{label}</FormLabel>
                  <FormControl>{renderInput(field)}</FormControl>

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
export default InputField
