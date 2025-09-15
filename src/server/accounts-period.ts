'use server'

import { db } from '@/db'

import { accounts_period } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import {
  insertAccountsPeriodSchema,
  insertAccountsPeriodSchemaType
} from '@/zod-schemas/accounts-period'

import { eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getAccountsPeriod(id: string) {
  const accountsPeriod = await db
    .select()
    .from(accounts_period)
    .where(eq(accounts_period.id, id))

  return accountsPeriod[0]
}

export const saveAccountsPeriodAction = actionClient
  .metadata({ actionName: 'saveAccountsPeriodAction' })
  .inputSchema(insertAccountsPeriodSchema, {
    // Here we use the `flattenValidationErrors` function to customize the returned validation errors
    // object to the client.
    handleValidationErrorsShape: async ve =>
      flattenValidationErrors(ve).fieldErrors
  })
  .action(
    async ({
      parsedInput: AccPeriod
    }: {
      parsedInput: insertAccountsPeriodSchemaType
    }) => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) redirect('/auth/sign-in')

      // New accounts period
      // All accounts periods are open by default - no need to set completed to true
      // createdAt and updatedAt are set by the database
      if (AccPeriod.id === '(New)') {
        const result = await db
          .insert(accounts_period)
          .values({
            clientId: AccPeriod.clientId,
            periodNumeric: AccPeriod.periodNumeric,
            periodEnding: AccPeriod.periodEnding
          })
          .returning({ insertedId: accounts_period.id })

        return {
          message: `Accounts period ID #${result[0].insertedId} created successfully`
        }
      }

      // Updating accounting period
      // updatedAt is set by the database
      const result = await db
        // await db
        .update(accounts_period)
        .set({
          clientId: AccPeriod.clientId,
          periodNumeric: AccPeriod.periodNumeric,
          periodEnding: AccPeriod.periodEnding,
          completed: AccPeriod.completed
        })
        .where(eq(accounts_period.id, AccPeriod.id!))
        .returning({ updatedId: accounts_period.id })

      return {
        message: `Accounting Period ID #${result[0].updatedId} updated successfully`
      }
    }
  )
