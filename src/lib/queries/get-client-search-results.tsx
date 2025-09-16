import { db } from '@/db'
import { clients } from '@/db/schema'
import { ilike, or } from 'drizzle-orm'

export async function getClientSearchResults(searchText: string) {
  const results = await db
    .select()
    .from(clients)
    .where(
      or(
        ilike(clients.name, `%${searchText}%`),
        ilike(clients.owner, `%${searchText}%`)
        // sql`lower(concat(${customers.firstName}, ' ', ${customers.lastName})) LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`,
      )
    )
    .orderBy(clients.name)
  return results
}
