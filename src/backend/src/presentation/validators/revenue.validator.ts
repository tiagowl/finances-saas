import { z } from 'zod';

export const createOccasionalRevenueSchema = z.object({
  name: z.string().min(2).max(200),
  notes: z.string().nullable().optional(),
  price: z.number().positive(),
  date: z.string().datetime(),
  categoryId: z.string().uuid().optional().nullable(),
});

export const updateOccasionalRevenueSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  date: z.string().datetime().optional(),
  categoryId: z.string().uuid().optional().nullable(),
});

export const createRecurringRevenueSchema = z.object({
  name: z.string().min(2).max(200),
  notes: z.string().nullable().optional(),
  price: z.number().positive(),
  installments: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
});

export const updateRecurringRevenueSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  installments: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
});

export const revenueParamsSchema = z.object({
  id: z.string().uuid('Invalid revenue ID'),
});

export const revenueQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
