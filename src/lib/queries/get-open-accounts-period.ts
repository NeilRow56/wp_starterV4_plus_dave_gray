import { db } from '@/db'
import { accounts_period, clients } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getOpenAccountsPeriods() {
  const results = await db
    .select({
      ticketDate: accounts_period.createdAt,
      periodEnding: accounts_period.periodEnding,
      periodNumeric: accounts_period.periodNumeric,
      name: clients.name,
      owner: clients.owner
    })
    .from(accounts_period)
    .leftJoin(clients, eq(accounts_period.clientId, clients.id))
    .where(eq(accounts_period.completed, false))

  return results
}
