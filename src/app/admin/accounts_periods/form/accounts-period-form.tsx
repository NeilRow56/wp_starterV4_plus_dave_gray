'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'

import { AccountingPeriod, Client } from '@/db/schema'

import { accountsPeriodSchema } from '@/zod-schemas/accounts-period'

interface TicketFormProps {
  client: Client // You must have a client to start an accounts period - so it is not optional
  accounts_period?: AccountingPeriod
}

export default function AccountsPeriodForm({
  client,
  accounts_period
}: TicketFormProps) {
  const form = useForm<z.infer<typeof accountsPeriodSchema>>({
    resolver: zodResolver(accountsPeriodSchema),
    mode: 'onBlur',
    defaultValues: {
      id: accounts_period?.id ?? '(New)',
      clientId: accounts_period?.clientId ?? client.id,
      periodNumeric: accounts_period?.periodNumeric,
      periodEnding: accounts_period?.periodEnding,
      completed: accounts_period?.completed ?? false
    }
  })

  async function submitForm(data: z.infer<typeof accountsPeriodSchema>) {
    console.log(data)
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {accounts_period?.id
            ? `Edit Ticket # ${accounts_period.id}`
            : 'New Ticket Form'}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className='flex flex-col gap-4 sm:flex-row sm:gap-8'
        >
          <p>{JSON.stringify(form.getValues())}</p>
        </form>
      </Form>
    </div>
  )
}
