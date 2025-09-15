'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'

import { AccountsPeriod, Client } from '@/db/schema'
import {
  insertAccountsPeriodSchema,
  insertAccountsPeriodSchemaType
} from '@/zod-schemas/accounts-period'
import { Button } from '@/components/ui/button'

import { InputWithLabel } from '@/components/form/input-with-label'
import { CheckboxWithLabel } from '@/components/form/checkbox-with-label'
import { Textarea } from '@/components/ui/textarea'
import { useAction } from 'next-safe-action/hooks'
import { saveAccountsPeriodAction } from '@/server/accounts-period'
import { toast } from 'sonner'
import { DisplayServerActionResponse } from '@/components/display-server-action-response'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

interface AccountsPeriodFormProps {
  client: Client // You must have a client to start an accounts period - so it is not optional
  accounts_period?: AccountsPeriod
}

export default function AccountsPeriodForm({
  client,
  accounts_period
}: AccountsPeriodFormProps) {
  const [isLoading] = useState(false)
  const defaultValues: insertAccountsPeriodSchemaType = {
    id: accounts_period?.id ?? '(New)',
    clientId: accounts_period?.clientId ?? client.id,
    periodNumeric: accounts_period?.periodNumeric ?? ' ',
    periodEnding: accounts_period?.periodEnding ?? ' ',
    completed: accounts_period?.completed ?? false
  }

  const form = useForm<insertAccountsPeriodSchemaType>({
    resolver: zodResolver(insertAccountsPeriodSchema),
    mode: 'onBlur',
    defaultValues
  })

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction
  } = useAction(saveAccountsPeriodAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(
          `Accounts period ${accounts_period ? 'updated ' : 'added'} successfully`
        )
      }
    },
    onError({ error }) {
      console.log(error)
      toast.error(
        `Failed to ${accounts_period ? 'update' : 'add'} accounts period`
      )
    }
  })

  async function submitForm(data: insertAccountsPeriodSchemaType) {
    executeSave(data)
  }

  return (
    <div className='container mx-auto'>
      <DisplayServerActionResponse result={saveResult} />
      <div className='flex min-w-md flex-col'>
        <h2 className='mb-2 text-2xl font-bold'>
          {accounts_period?.id
            ? // ? `Edit Accounting Period  # ${accounts_period.id}`
              `Edit Accounting Period  `
            : 'New Accounting Period Form'}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className='mt-24 flex flex-col gap-4'
        >
          <div className='container mx-auto flex w-full max-w-lg min-w-[400px] flex-col gap-4'>
            <InputWithLabel<insertAccountsPeriodSchemaType>
              fieldTitle='Period Header'
              nameInSchema='periodNumeric'
              className=''
            />
            <InputWithLabel<insertAccountsPeriodSchemaType>
              fieldTitle='Period Ending'
              nameInSchema='periodEnding'
            />

            {isLoading ? (
              <p>Loading...</p>
            ) : accounts_period?.id ? (
              <CheckboxWithLabel<insertAccountsPeriodSchemaType>
                fieldTitle='Completed'
                nameInSchema='completed'
                message='Yes'
              />
            ) : null}

            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-3 ...'>
                <h3 className='text-lg font-bold'>Client Information:</h3>
                <hr className='w-2/5' />
              </div>

              <div className=''>
                <span className='mr-5 font-bold'> Client name: </span>
              </div>
              <div className='col-span-2'>
                <span>{client.name}</span>
              </div>
              <div className=''>
                <span className='mr-5 font-bold'>
                  {' '}
                  Client manager:{' '}
                  <span className='text-muted-foreground'>
                    (revenue centre)
                  </span>{' '}
                </span>
              </div>
              <div className='col-span-2'>
                <span>{client.owner}</span>
              </div>
              <div className='flex w-full overflow-hidden'>
                <span className='mr-5 font-bold'> Notes: </span>
              </div>
              <div className='col-span-2 text-wrap'>
                <Textarea value={(client.notes as string) ?? ''} readOnly />
              </div>
            </div>
            <div className='full flex justify-between'>
              <Button
                type='submit'
                className='w-1/5'
                variant='default'
                title='Save'
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className='animate-spin' /> Saving
                  </>
                ) : (
                  'Save'
                )}
              </Button>

              <Button
                type='button'
                className='w-1/5'
                variant='destructive'
                title='Reset'
                onClick={() => {
                  form.reset(defaultValues)
                  resetSaveAction()
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
