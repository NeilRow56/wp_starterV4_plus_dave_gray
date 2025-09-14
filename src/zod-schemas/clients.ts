import { z } from 'zod/v4'

import { clients } from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const insertClientSchema = createInsertSchema(clients, {
  name: schema =>
    schema
      .min(1, 'Name is required')
      .max(20, { error: 'Name must be at most 20 characters!' }),
  userId: schema => schema.min(1, 'UserId is required'),
  owner: schema =>
    schema
      .min(1, 'Fee earner is required')
      .max(20, { error: 'Fee earner must be at most 20 characters!' }),
  entity_type: schema => schema.length(2, 'Entity type is required')
})

export const selectClientSchema = createSelectSchema(clients)

export type insertClientSchemaType = z.infer<typeof insertClientSchema>
export type selectClientSchemaType = z.infer<typeof selectClientSchema>
