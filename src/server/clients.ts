'use server'

import { db } from '@/db'
import { clients } from '@/db/schema'
import { auth } from '@/lib/auth'
import { asc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getAllClients() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/auth/sign-in')

  const allClients = await db.select().from(clients).orderBy(asc(clients.name))

  return allClients
}

export async function getClient(id: string) {
  const client = await db.select().from(clients).where(eq(clients.id, id))
  // client is returned as an array - even though there is only one item
  return client[0]
}

export async function getClientTwo(id: string) {
  const client = await db.select().from(clients).where(eq(clients.id, id))

  return client[0]
}
