'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { Client, User } from '@/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputWithLabel } from '@/components/form/input-with-label'
import { SelectWithLabel } from '@/components/form/select-with-label'
import { EntityArray } from '@/constants/entity_cataegory'
import { TextAreaWithLabel } from '@/components/form/text-area-with-label'
import {
  insertClientSchemaType,
  insertClientSchema
} from '@/zod-schemas/clients'

interface ClientFormProps {
  user: User // You must have a user to start a customer - so it is not optional
  client?: Client
}

export const ClientForm = ({ user, client }: ClientFormProps) => {
  // const [isLoading] = useState(false)
  const defaultValues: insertClientSchemaType = {
    name: client?.name ?? '',
    userId: client?.userId ?? user.id,
    entity_type: client?.entity_type ?? '',
    owner: client?.owner ?? '',
    notes: client?.notes ?? '',
    active: client?.active ?? true
  }
  const form = useForm<insertClientSchemaType>({
    resolver: zodResolver(insertClientSchema),
    mode: 'onBlur',
    defaultValues
  })

  async function submitForm(data: insertClientSchemaType) {
    console.log(data)
  }
  return (
    <div className='container mx-auto mt-24'>
      <div className='flex flex-col gap-1 sm:px-8'>
        <div className='items-center justify-center'>
          <h2 className='text-2xl font-bold lg:text-3xl'>
            {client?.id ? `Edit Client # ${client.id}` : 'New Client Form'}
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='mx-auto mt-8 flex w-4xl flex-col gap-4 md:gap-8 xl:flex-row'
          >
            <div className='flex w-full flex-col gap-4'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <FormControl>
                      <Input placeholder='' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <InputWithLabel<insertClientSchemaType>
                fieldTitle='Name'
                nameInSchema='name'
              />

              <InputWithLabel<insertClientSchemaType>
                fieldTitle='Fee Earner'
                nameInSchema='owner'
              />

              <SelectWithLabel<insertClientSchemaType>
                fieldTitle='Entity Type'
                nameInSchema='entity_type'
                data={EntityArray}
              />

              {/* {isLoading ? (
                <p>Loading...</p>
              ) : client?.id ? (
                <CheckboxWithLabel<insertClientSchemaType>
                  fieldTitle='Active'
                  nameInSchema='active'
                  message='Yes'
                />
              ) : null} */}
            </div>

            <div className='flex w-full flex-col gap-4'>
              <TextAreaWithLabel<insertClientSchemaType>
                fieldTitle='Notes'
                nameInSchema='notes'
                className='h-40 p-0'
              />

              <div className='flex max-w-md justify-between'>
                <Button
                  type='submit'
                  className='w-1/5'
                  variant='default'
                  title='Save'
                >
                  Save
                </Button>

                <Button
                  type='button'
                  className='w-1/5'
                  variant='destructive'
                  title='Reset'
                  onClick={() => form.reset(defaultValues)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
