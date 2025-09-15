import Form from 'next/form'
import { Input } from '@/components/ui/input'
import SearchButton from '@/components/search-button'

export default function ClientSearch() {
  return (
    <Form action='/admin/clients' className='flex items-center gap-2'>
      <Input
        name='searchText'
        type='text'
        placeholder='Search Clients'
        className='w-full'
        autoFocus
      />
      <SearchButton />
    </Form>
  )
}
