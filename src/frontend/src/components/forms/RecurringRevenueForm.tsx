import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import RichTextEditor from '../ui/RichTextEditor';
import { recurringRevenueFormSchema, type RecurringRevenueFormValues } from '../../lib/formSchemas';

interface RecurringRevenueFormProps {
  initialData?: { name?: string; price?: number; installments?: number | null; notes?: string | null };
  onSubmit: (data: { name: string; price: number; installments?: number | null; notes?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function RecurringRevenueForm({ initialData, onSubmit, onCancel }: RecurringRevenueFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RecurringRevenueFormValues>({
    resolver: zodResolver(recurringRevenueFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price ?? undefined,
      notes: initialData?.notes || '',
      indefinido: initialData?.installments == null,
      installments: initialData?.installments ?? undefined,
    },
  });

  const indefinido = watch('indefinido');

  useEffect(() => {
    reset({
      name: initialData?.name || '',
      price: initialData?.price ?? undefined,
      notes: initialData?.notes || '',
      indefinido: initialData?.installments == null,
      installments: initialData?.installments ?? undefined,
    });
  }, [initialData, reset]);

  const onFormSubmit = async (data: RecurringRevenueFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        price: data.price,
        installments: data.indefinido ? null : (data.installments ?? null),
        notes: data.notes,
      });
    } catch {
      setError('root', { message: 'Erro ao salvar. Tente novamente.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      <Input label="Nome" required placeholder="ex: Salário" error={errors.name?.message} {...register('name')} />
      <Input label="Valor" type="number" step="0.01" min="0.01" required placeholder="ex: 5000" error={errors.price?.message} {...register('price')} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Parcelas</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            disabled={indefinido}
            placeholder="Nº de parcelas"
            className={`h-10 w-32 rounded-lg border text-sm bg-white px-3 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.installments ? 'border-red-500' : 'border-slate-200'
            }`}
            {...register('installments')}
          />
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input type="checkbox" className="rounded border-slate-300 text-primary-700 focus:ring-primary-700" {...register('indefinido')} />
            Indefinido
          </label>
        </div>
        {errors.installments && <p className="text-sm text-red-500">{errors.installments.message}</p>}
      </div>

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <RichTextEditor label="Anotações" value={field.value || ''} onChange={field.onChange} placeholder="Descrição opcional..." error={errors.notes?.message} />
        )}
      />

      {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting} type="button">Cancelar</Button>
        <Button type="submit" loading={isSubmitting}>{initialData ? 'Salvar' : 'Criar'}</Button>
      </div>
    </form>
  );
}
