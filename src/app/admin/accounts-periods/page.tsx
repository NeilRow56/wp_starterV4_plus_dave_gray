import { getAccountsPeriodSearchResults } from '@/lib/queries/get-accounts-period-search-results'
import AccountsPeriodsSearch from './accounts-period-search'
import { getOpenAccountsPeriods } from '@/lib/queries/get-open-accounts-period'

export const metadata = {
  title: 'Ticket Search'
}

export default async function AccountsPeriodsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { searchText } = await searchParams

  if (!searchText) {
    const results = await getOpenAccountsPeriods()
    return (
      <>
        <AccountsPeriodsSearch />
        <p>{JSON.stringify(results)}</p>
      </>
    )
  }

  const results = await getAccountsPeriodSearchResults(searchText)

  return (
    <>
      <AccountsPeriodsSearch />
      <p>{JSON.stringify(results)}</p>
    </>
  )
}
