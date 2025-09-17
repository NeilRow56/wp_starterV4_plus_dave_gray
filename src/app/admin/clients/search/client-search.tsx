import Form from 'next/form'
import { Input } from '@/components/ui/input'
import SearchButton from '@/components/search-button'

export default function ClientSearch() {
  return (
    <Form
      action='/admin/clients/search'
      className='flex flex-col items-center gap-2'
    >
      <Input
        name='searchText'
        type='text'
        placeholder='Search Clients'
        className='w-full'
        autoFocus
      />
      <SearchButton />

      <div className='mt-24'>
        <h1 className='text-5xl'>
          NB:THIS PAGE CURRENTLY SHOWS RESULTS FOR ALL USERS
        </h1>
      </div>
    </Form>
  )
}
