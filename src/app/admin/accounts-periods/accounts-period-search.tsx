import Form from 'next/form'
import { Input } from '@/components/ui/input'
import SearchButton from '@/components/search-button'

export default function AccountsPeriodsSearch() {
  return (
    <Form action='/admin/acounts-periods' className='flex items-center gap-2'>
      <Input
        name='searchText'
        type='text'
        placeholder='Search Accounts Periods'
        className='w-full'
      />
      <SearchButton />
    </Form>
  )
}
