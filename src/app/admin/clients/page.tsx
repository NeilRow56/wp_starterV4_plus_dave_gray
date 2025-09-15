import React from 'react'
import ClientSearch from './client-search'
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

  //query database

  const results = await getClientSearchResults(searchText)

  return (
    <>
      <ClientSearch />
      <p>{JSON.stringify(results)}</p>
      {/* {results.length ? <ClientTable data={results} /> : (
                <p className="mt-4">No results found</p>
            )} */}
    </>
  )
}
