import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../stores/authStore';
import { useApiStore } from '../stores/apiStore';
import { getColdStartMessage } from '../services/httpClient';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { loginFormSchema, type LoginFormValues } from '../lib/formSchemas';

export default function Login() {
  const navigate = useNavigate();
  const { token, login, loading, error } = useAuthStore();
  const wakingUp = useApiStore((s) => s.wakingUp);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
    if (!useAuthStore.getState().error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary-700 flex items-center justify-center mb-3">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Finances</h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">beta</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Acesse sua conta</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input label="Email" type="email" required placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Senha" type="password" required placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Button type="submit" loading={loading || wakingUp} className="w-full">
              {wakingUp ? 'Conectando ao servidor…' : 'Entrar'}
            </Button>
          </form>

          {(loading || wakingUp) && (
            <p className="text-xs text-amber-700 text-center mt-3">{getColdStartMessage()}</p>
          )}

          <p className="text-sm text-slate-500 text-center mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-primary-700 font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
