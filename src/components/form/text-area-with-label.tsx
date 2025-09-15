'use client'

import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Textarea } from '@/components/ui/textarea'
import { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props<S> = {
  fieldTitle: string
  nameInSchema: keyof S & string
  className?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextAreaWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: Props<S>) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='text-base' htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <div className='hidden'>{className}</div>
          <FormControl>
            <Textarea
              id={nameInSchema}
              className={cn(
                'h-51 w-full max-w-lg disabled:text-blue-500 disabled:opacity-75 dark:disabled:text-yellow-300'
              )}
              {...props}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
