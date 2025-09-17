'use server'

import { db } from '@/db'
import { clients } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import {
  insertClientSchema,
  insertClientSchemaType
} from '@/zod-schemas/clients'
import { and, asc, eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
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

export async function getUserClients(userId: string) {
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

export const deleteClient = async (id: string) => {
  try {
    await db.delete(clients).where(eq(clients.id, id))
    return { success: true, message: 'Client deleted successfully' }
  } catch {
    return { success: false, message: 'Failed to delete client' }
  }
}

//use-safe-actions

export const saveClientAction = actionClient
  .metadata({ actionName: 'saveClientAction' })
  .inputSchema(insertClientSchema, {
    handleValidationErrorsShape: async ve =>
      flattenValidationErrors(ve).fieldErrors
  })
  .action(
    async ({
      parsedInput: client
    }: {
      parsedInput: insertClientSchemaType
    }) => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) redirect('/auth/sign-in')

      // ERROR TESTS

      // throw Error('test error client create action')

      // New Client
      // All new clients are active by default - no need to set active to true
      // createdAt and updatedAt are set by the database

      if (client.id === '') {
        const result = await db
          .insert(clients)
          .values({
            name: client.name,
            userId: client.userId,
            entity_type: client.entity_type,
            owner: client.owner,

            // customer.notes is an optional field
            ...(client.notes?.trim() ? { notes: client.notes } : {})
          })
          .returning({ insertedId: clients.id })

        return {
          message: `Client ID #${result[0].insertedId} created successfully`
        }
      }

      // Existing client
      // updatedAt is set by the database
      const result = await db
        .update(clients)
        .set({
          name: client.name,
          userId: client.userId,
          entity_type: client.entity_type,
          owner: client.owner,
          // customer.notes is an optional field
          notes: client.notes?.trim() ?? null,
          active: client.active
        })
        // ! confirms customer.id will always exist for the update function
        .where(eq(clients.id, client.id!))
        .returning({ updatedId: clients.id })

      return {
        message: `Client ID #${result[0].updatedId} updated successfully`
      }
    }
  )
