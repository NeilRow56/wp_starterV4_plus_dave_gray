'use server'

import { db } from '@/db'

import { accountsPeriod } from '@/db/schema'

import { eq } from 'drizzle-orm'

export async function getAccountsPeriod(id: string) {
  const accounts_period = await db
    .select()
    .from(accountsPeriod)
    .where(eq(accountsPeriod.id, id))

  return accounts_period[0]
}
