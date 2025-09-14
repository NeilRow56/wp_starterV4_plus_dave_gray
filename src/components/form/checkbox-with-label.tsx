'use client'

import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Checkbox } from '@/components/ui/checkbox'

type Props<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  message: string
}

export function CheckboxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  message
}: Props<S>) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className='flex w-full items-center gap-2'>
          <FormLabel className='mt-2 w-1/3 text-base' htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>

          <div className='mt-2 flex items-center gap-2'>
            <FormControl>
              <Checkbox
                className='items-center'
                id={nameInSchema}
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            {message}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
