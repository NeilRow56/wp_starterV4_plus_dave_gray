import { z } from 'zod/v4'

import { accounts_period } from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const insertAccountsPeriodSchema = createInsertSchema(accounts_period, {
  clientId: schema => schema.min(1, 'UserId is required'),
  periodNumeric: schema =>
    schema
      .min(1, 'Period header is required')
      .max(6, { error: 'Period header must be at most 6 characters!' }),
  periodEnding: schema =>
    schema
      .min(1, 'Period ending is required')
      .max(30, { error: 'Period ending must be at most 30 characters!' })
})

export const selectAccountsPeriodSchema = createSelectSchema(accounts_period)

export type insertAccountsPeriodSchemaType = z.infer<
  typeof insertAccountsPeriodSchema
>
export type selectAccountsPeriodSchemaType = z.infer<
  typeof selectAccountsPeriodSchema
>
