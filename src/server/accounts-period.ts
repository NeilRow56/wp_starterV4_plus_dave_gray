'use server'

import { db } from '@/db'

import { accounts_period } from '@/db/schema'

import { eq } from 'drizzle-orm'

export async function getAccountsPeriod(id: string) {
  const accountsPeriod = await db
    .select()
    .from(accounts_period)
    .where(eq(accounts_period.id, id))

  return accountsPeriod[0]
}
