import { z } from 'zod/v4'

export const accountsPeriodSchema = z.object({
  id: z.union([z.string(), z.literal('(New)')]),
  clientId: z
    .string()
    .min(1, { error: 'First name is required' })
    .max(20, { error: 'First name must be at most 20 characters!' }),
  periodNumeric: z.int(),
  periodEnding: z
    .string()
    .min(1, { error: 'Period end is required' })
    .max(20, { error: 'Period end must be at most 20 characters!' }),
  completed: z.boolean()
})
