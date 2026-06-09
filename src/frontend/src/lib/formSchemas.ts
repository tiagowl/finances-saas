import { z } from 'zod';

const optionalNotes = z
  .string()
  .optional()
  .transform((val) => {
    const trimmed = val?.trim();
    if (!trimmed || trimmed === '<p></p>') return undefined;
    return trimmed;
  });

const positivePrice = z.coerce
  .number({ invalid_type_error: 'Valor é obrigatório' })
  .positive('Valor deve ser maior que zero');

const nameField = z
  .string()
  .trim()
  .min(1, 'Nome é obrigatório')
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(200, 'Nome deve ter no máximo 200 caracteres');

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().trim().min(1, 'Email é obrigatório').email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

export const updateProfileFormSchema = z
  .object({
    email: z.string().trim().min(1, 'Email é obrigatório').email('Email inválido'),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword.length > 0) {
      if (data.newPassword.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nova senha deve ter no mínimo 6 caracteres',
          path: ['newPassword'],
        });
      }
      if (!data.currentPassword?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha atual é obrigatória para alterar a senha',
          path: ['currentPassword'],
        });
      }
    }
  });

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  notes: optionalNotes,
  maxBudget: z.preprocess(
    (val) => (val === '' || val == null ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Orçamento inválido' }).positive('Orçamento deve ser maior que zero').optional(),
  ),
});

export const occasionalExpenseFormSchema = z.object({
  name: nameField,
  price: positivePrice,
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória').uuid('Categoria inválida'),
  notes: optionalNotes,
});

export const recurringExpenseFormSchema = z
  .object({
    name: nameField,
    price: positivePrice,
    categoryId: z.string().min(1, 'Categoria é obrigatória').uuid('Categoria inválida'),
    notes: optionalNotes,
    indefinido: z.boolean(),
    installments: z.preprocess(
      (val) => (val === '' || val == null ? undefined : Number(val)),
      z.number().int('Parcelas deve ser um número inteiro').positive('Parcelas deve ser maior que zero').optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.indefinido && (data.installments == null || Number.isNaN(data.installments))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe um número válido de parcelas',
        path: ['installments'],
      });
    }
  });

export const occasionalRevenueFormSchema = z.object({
  name: nameField,
  price: positivePrice,
  date: z.string().min(1, 'Data é obrigatória'),
  notes: optionalNotes,
});

export const recurringRevenueFormSchema = z
  .object({
    name: nameField,
    price: positivePrice,
    notes: optionalNotes,
    indefinido: z.boolean(),
    installments: z.preprocess(
      (val) => (val === '' || val == null ? undefined : Number(val)),
      z.number().int('Parcelas deve ser um número inteiro').positive('Parcelas deve ser maior que zero').optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.indefinido && (data.installments == null || Number.isNaN(data.installments))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe um número válido de parcelas',
        path: ['installments'],
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type OccasionalExpenseFormValues = z.infer<typeof occasionalExpenseFormSchema>;
export type RecurringExpenseFormValues = z.infer<typeof recurringExpenseFormSchema>;
export type OccasionalRevenueFormValues = z.infer<typeof occasionalRevenueFormSchema>;
export type RecurringRevenueFormValues = z.infer<typeof recurringRevenueFormSchema>;
