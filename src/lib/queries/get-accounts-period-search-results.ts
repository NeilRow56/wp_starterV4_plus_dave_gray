import { db } from '@/db'
import { accounts_period, clients } from '@/db/schema'

import { eq, ilike, or, asc } from 'drizzle-orm'

export async function getAccountsPeriodSearchResults(searchText: string) {
  const results = await db
    .select({
      id: accounts_period.id,
      createdAt: accounts_period.createdAt,
      periodEnding: accounts_period.periodEnding,
      Name: clients.name,
      owner: clients.owner,
      active: clients.active,
      completed: accounts_period.completed
    })
    .from(accounts_period)
    .leftJoin(clients, eq(accounts_period.clientId, clients.id))
    .where(
      or(
        ilike(accounts_period.periodEnding, `%${searchText}%`),
        ilike(accounts_period.completed, `%${searchText}%`),
        ilike(clients.name, `%${searchText}%`),
        ilike(clients.owner, `%${searchText}%`)
      )
    )
    .orderBy(asc(clients.name))

  return results
}

export type AccountsPeriodSearchResultsType = Awaited<
  ReturnType<typeof getAccountsPeriodSearchResults>
>
