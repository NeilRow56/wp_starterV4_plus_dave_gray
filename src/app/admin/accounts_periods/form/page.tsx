import { BackButton } from '@/components/back-button'
import { getAccountsPeriod } from '@/server/accounts-period'
import { getClient } from '@/server/clients'

import * as Sentry from '@sentry/nextjs'

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
      console.log(client)
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
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
