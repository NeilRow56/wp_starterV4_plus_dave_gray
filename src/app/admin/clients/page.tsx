import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Suspense } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { ReactNode } from 'react'

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        buttonVariants({
          variant: 'secondary',
          className: 'pointer-events-none w-24 animate-pulse'
        }),
        className
      )}
    />
  )
}

export function SkeletonArray({
  amount,
  children
}: {
  amount: number
  children: ReactNode
}) {
  return Array.from({ length: amount }).map(() => children)
}

export function SkeletonText({
  rows = 1,
  size = 'md',
  className
}: {
  rows?: number
  size?: 'md' | 'lg'
  className?: string
}) {
  return (
    <div className='flex flex-col gap-1'>
      <SkeletonArray amount={rows}>
        <div
          className={cn(
            'bg-secondary w-full animate-pulse rounded-sm',
            rows > 1 && 'last:w-3/4',
            size === 'md' && 'h-3',
            size === 'lg' && 'h-5',
            className
          )}
        />
      </SkeletonArray>
    </div>
  )
}
import { db } from '@/db'
import { clients } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { getCurrentUserId } from '@/server/users'
import { redirect } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

import { PencilIcon } from 'lucide-react'
import DeleteClientButton from '@/components/clients/delete-client-button'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'

export const metadata = {
  title: 'Client Search'
}

export default async function Clients() {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <SkeletonArray amount={3}>
              <SkeletonClientCard />
            </SkeletonArray>
          }
        >
          <ClientsByUserIdTable />
        </Suspense>
      </div>
    </>
  )
}

async function ClientsByUserIdTable() {
  const { userId } = await getCurrentUserId()
  if (userId == null) return redirect('/auth/sign-in')

  const clients = await getUserClients(userId)

  if (clients.length === 0) {
    return (
      <>
        <div className='mx-auto flex max-w-6xl flex-col gap-2'>
          <EmptyState
            title='Clients'
            description='You have no clients yet. Click on the button below to create your first
        client'
          />
        </div>
        <div className='- mt-12 flex w-full justify-center'>
          <Button asChild size='lg' className='i flex w-[200px]'>
            <Link href='/admin/clients/create'>Create Client</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className='container mx-auto my-6'>
      <PageHeader title='Cients' />
      <Table>
        <TableCaption className='text-xl font-bold'>
          A list of your clients.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell className='font-medium'>
                {client.id.slice(0, 8)}
              </TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.owner}</TableCell>
              <TableCell>
                {/* <UserRoleSelect userId={user.id} role={user.role as Role} /> */}
                Active Select
              </TableCell>
              <TableCell className='space-x-2 text-right'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='ghost' className='cursor-pointer'>
                      <PencilIcon className='size-4 text-red-500' />
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Client</DialogTitle>
                      Client Form
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* <Button variant='ghost' className='mr-2 cursor-pointer'>
                  <PencilIcon />
                </Button> */}
                <DeleteClientButton clientId={client.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SkeletonClientCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonText className='w-3/4' />
        </CardTitle>
        <CardDescription>
          <SkeletonText className='w-1/2' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonText rows={3} />
      </CardContent>
      <CardFooter>
        <SkeletonButton />
      </CardFooter>
    </Card>
  )
}

async function getUserClients(userId: string) {
  const clientsByUserId = await db
    .select({
      id: clients.id,
      name: clients.name,
      userId: clients.userId,
      owner: clients.owner,
      active: clients.active
    })
    .from(clients)
    .where(and(eq(clients.userId, userId)))
    .orderBy(asc(clients.name))

  return clientsByUserId
}
