import { BackButton } from '@/components/back-button'
import * as Sentry from '@sentry/nextjs'
import { ClientForm } from './client-form'
import { getClientUser } from '@/server/users'
import { getClientTwo } from '@/server/clients'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { clientId } = await searchParams

  if (!clientId) return { title: 'New Client' }

  return { title: `Edit Client #${clientId}` }
}

export default async function ClientFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  try {
    const { clientId } = await searchParams

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      redirect('/auth/sign-in')
    }

    const userId = session.session.userId

    if (!userId && !clientId) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>
            Client ID OR User ID required to load client form
          </h2>
          <BackButton title='Go Back' variant='default' className='w-[100px]' />
        </>
      )
    }

    // New client form
    if (userId) {
      const user = await getClientUser(userId)

      if (!user) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>User ID #{userId} not found</h2>
            <BackButton
              title='Go Back'
              variant='default'
              className='flex w-[100px]'
            />
          </>
        )
      }

      //   if (!client.active) {
      //     return (
      //       <>
      //         <h2 className='mb-2 text-2xl'>
      //           Client ID #{clientId} is not active.
      //         </h2>
      //         <BackButton title='Go Back' variant='default' />
      //       </>
      //     )
      //   }

      // return client form
      if (userId && !clientId) {
        return <ClientForm user={user} />
      }
    }

    // Edit client form
    if (clientId) {
      const client = await getClientTwo(clientId)

      if (!client) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>Client ID #{clientId} not found</h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      const user = await getClientUser(client.userId)

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

      // return client form

      return <ClientForm client={client} user={user} />
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
