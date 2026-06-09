import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').max(100, 'Name must have at most 100 characters'),
  notes: z.string().nullable().optional(),
  maxBudget: z.number().positive('Max budget must be positive').nullable().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  notes: z.string().nullable().optional(),
  maxBudget: z.number().positive().nullable().optional(),
});

export const categoryParamsSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});
