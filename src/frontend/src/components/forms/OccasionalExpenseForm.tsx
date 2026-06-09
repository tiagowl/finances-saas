import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import RichTextEditor from '../ui/RichTextEditor';
import { occasionalExpenseFormSchema, type OccasionalExpenseFormValues } from '../../lib/formSchemas';

interface Option { value: string; label: string; }

interface OccasionalExpenseFormProps {
  initialData?: { name?: string; price?: number; date?: string; categoryId?: string; notes?: string | null };
  categories: Option[];
  onSubmit: (data: { name: string; price: number; date: string; categoryId: string; notes?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function OccasionalExpenseForm({ initialData, categories, onSubmit, onCancel }: OccasionalExpenseFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OccasionalExpenseFormValues>({
    resolver: zodResolver(occasionalExpenseFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price ?? undefined,
      date: initialData?.date ? initialData.date.split('T')[0] : '',
      categoryId: initialData?.categoryId || '',
      notes: initialData?.notes || '',
    },
  });

  useEffect(() => {
    reset({
      name: initialData?.name || '',
      price: initialData?.price ?? undefined,
      date: initialData?.date ? initialData.date.split('T')[0] : '',
      categoryId: initialData?.categoryId || '',
      notes: initialData?.notes || '',
    });
  }, [initialData, reset]);

  const onFormSubmit = async (data: OccasionalExpenseFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        price: data.price,
        date: new Date(data.date).toISOString(),
        categoryId: data.categoryId,
        notes: data.notes,
      });
    } catch {
      setError('root', { message: 'Erro ao salvar. Tente novamente.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      <Input label="Nome" required placeholder="ex: Almoço no restaurante" error={errors.name?.message} {...register('name')} />
      <Input label="Valor" type="number" step="0.01" min="0.01" required placeholder="ex: 89.90" error={errors.price?.message} {...register('price')} />
      <Input label="Data" type="date" required error={errors.date?.message} {...register('date')} />
      <Select label="Categoria" required options={categories} placeholder="Selecione uma categoria" error={errors.categoryId?.message} {...register('categoryId')} />

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
