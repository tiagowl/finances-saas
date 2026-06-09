import { z } from 'zod';

export const createOccasionalExpenseSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').max(200),
  notes: z.string().nullable().optional(),
  price: z.number().positive('Price must be positive'),
  date: z.string().datetime('Invalid date format'),
  categoryId: z.string().uuid('Invalid category ID'),
});

export const updateOccasionalExpenseSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  date: z.string().datetime().optional(),
  categoryId: z.string().uuid().optional(),
});

export const createRecurringExpenseSchema = z.object({
  name: z.string().min(2).max(200),
  notes: z.string().nullable().optional(),
  price: z.number().positive(),
  installments: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid(),
});

export const updateRecurringExpenseSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  notes: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  installments: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid().optional(),
});

export const expenseParamsSchema = z.object({
  id: z.string().uuid('Invalid expense ID'),
});

export const expenseQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
