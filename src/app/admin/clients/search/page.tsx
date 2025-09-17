import React from 'react'
import ClientSearch from './client-search'

import ClientTable from './client-table'
import { getClientSearchResults } from '@/lib/queries/get-client-search-results'

export const metadata = {
  title: 'Client Search'
}

export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { searchText } = await searchParams

  if (!searchText) return <ClientSearch />

  // temporary check by Sentry

  // const span = Sentry.startInactiveSpan({
  //   name: 'getClientSearchResults-1'
  // })

  //query database
  const results = await getClientSearchResults(searchText)

  // span.end()

  return (
    <>
      <ClientSearch />
      {/* This table only appears when a search is activated */}

      {results.length ? (
        <ClientTable data={results} />
      ) : (
        <p className='mt-4'>No results found</p>
      )}
    </>
  )
}
