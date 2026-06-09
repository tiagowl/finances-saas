import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToastStore } from '../hooks/useToast';
import { updateProfileFormSchema, type UpdateProfileFormValues } from '../lib/formSchemas';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.add);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      email: user?.email ?? '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormValues) => {
    const payload: { email?: string; currentPassword?: string; newPassword?: string } = {};
    if (data.email !== user?.email) payload.email = data.email;
    if (data.newPassword) {
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
    }
    if (Object.keys(payload).length === 0) {
      toast('info', 'Nenhuma alteração para salvar');
      return;
    }

    try {
      const result = await authApi.updateProfile(payload);
      localStorage.setItem('finances_token', result.token);
      localStorage.setItem('finances_user', JSON.stringify(result.user));
      useAuthStore.setState({ user: result.user, token: result.token });
      reset({
        email: result.user.email,
        currentPassword: '',
        newPassword: '',
      });
      toast('success', 'Perfil atualizado com sucesso');
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Meu Perfil</h1>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
            <User className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 mt-1">
              {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />

          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Alterar Senha
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  label="Senha atual"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Deixe em branco para manter"
                  error={errors.currentPassword?.message}
                  className="pr-10"
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-8 text-slate-400 hover:text-slate-600"
                  aria-label={showCurrentPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Nova senha"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Mínimo de 6 caracteres"
                  error={errors.newPassword?.message}
                  className="pr-10"
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-8 text-slate-400 hover:text-slate-600"
                  aria-label={showNewPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={isSubmitting}>
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
