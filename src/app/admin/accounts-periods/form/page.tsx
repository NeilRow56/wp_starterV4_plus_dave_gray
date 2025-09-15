import { BackButton } from '@/components/back-button'
import { auth } from '@/lib/auth'
import { getAccountsPeriod } from '@/server/accounts-period'
import { getClient } from '@/server/clients'

import * as Sentry from '@sentry/nextjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AccountsPeriodForm from './accounts-period-form'

export default async function AccountsPeriodFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  try {
    const { clientId, accountsPeriodId } = await searchParams

    if (!clientId && !accountsPeriodId) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>
            Accounts period ID OR Client ID required to load accounts period
            form
          </h2>
          <BackButton title='Go Back' variant='default' className='w-[100px]' />
        </>
      )
    }

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      redirect('/auth/sign-in')
    }

    const userId = session.session.userId

    // New accountsPeriod form
    if (clientId) {
      const client = await getClient(clientId)

      if (!client) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>Client ID #{clientId} not found</h2>
            <BackButton
              title='Go Back'
              variant='default'
              className='flex w-[100px]'
            />
          </>
        )
      }

      if (!client.active) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Client ID #{clientId} is not active.
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      // return accountsPeriod form
      // const user = await getCustomerUser(customer.userId)

      if (userId !== client.userId) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Client-user ID and current-session-user ID do not match
            </h2>

            <BackButton
              title='Go Back'
              variant='default'
              className='w-[100px]'
            />
          </>
        )
      }
      console.log(client)

      return <AccountsPeriodForm client={client} />
    }

    // Edit accountsPeriod form
    if (accountsPeriodId) {
      const accountsPeriod = await getAccountsPeriod(accountsPeriodId)

      if (!accountsPeriod) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              AccountsPeriod ID #{accountsPeriodId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      const client = await getClient(accountsPeriod.clientId)

      // return accountsPeriod form
      console.log('accountsPeriod: ', accountsPeriod)
      console.log('client: ', client)
      return (
        <AccountsPeriodForm client={client} accounts_period={accountsPeriod} />
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
