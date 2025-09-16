'use client'

import type { selectClientSchemaType } from '@/zod-schemas/clients'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { useRouter } from 'next/navigation'

type Props = {
  data: selectClientSchemaType[]
}

export default function ClientTable({ data }: Props) {
  const router = useRouter()

  const columnHeadersArray: Array<keyof selectClientSchemaType> = [
    'name',
    'entity_type',
    'owner',
    'active'
  ]

  const columnHelper = createColumnHelper<selectClientSchemaType>()

  const columns = columnHeadersArray.map(columnName => {
    return columnHelper.accessor(columnName, {
      id: columnName,
      header: columnName[0].toUpperCase() + columnName.slice(1)
    })
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className='border-border mt-6 overflow-hidden rounded-lg border'>
      <Table className='border'>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className='bg-secondary'>
                  <div>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              className='hover:bg-border/25 dark:hover:bg-ring/40 cursor-pointer'
              onClick={() =>
                router.push(`/customers/form?customerId=${row.original.id}`)
              }
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className='border'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
