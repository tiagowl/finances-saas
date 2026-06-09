import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import RichTextEditor from '../ui/RichTextEditor';
import { categoryFormSchema, type CategoryFormValues } from '../../lib/formSchemas';

interface CategoryFormProps {
  initialData?: { name?: string; notes?: string | null; maxBudget?: number | null };
  onSubmit: (data: { name: string; notes?: string; maxBudget?: number }) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      notes: initialData?.notes || '',
      maxBudget: initialData?.maxBudget ?? undefined,
    },
  });

  useEffect(() => {
    reset({
      name: initialData?.name || '',
      notes: initialData?.notes || '',
      maxBudget: initialData?.maxBudget ?? undefined,
    });
  }, [initialData, reset]);

  const onFormSubmit = async (data: CategoryFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        notes: data.notes,
        maxBudget: data.maxBudget,
      });
    } catch {
      setError('root', { message: 'Erro ao salvar. Tente novamente.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nome"
        required
        placeholder="ex: Alimentação"
        error={errors.name?.message}
        {...register('name')}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            label="Anotações"
            value={field.value || ''}
            onChange={field.onChange}
            placeholder="Descrição opcional..."
            error={errors.notes?.message}
          />
        )}
      />

      <Input
        label="Orçamento máximo"
        type="number"
        step="0.01"
        min="0"
        placeholder="ex: 2000"
        error={errors.maxBudget?.message}
        {...register('maxBudget')}
      />

      {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting} type="button">
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
