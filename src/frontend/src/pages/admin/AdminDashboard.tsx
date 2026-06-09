import { useEffect, useState } from 'react';
import { BarChart3, Users, MousePointerClick, FileText } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { AdminDashboardStats } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Administrativo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Usuários</p>
              <p className="text-2xl font-bold text-slate-900">{stats.userCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Ações</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.mostUsedActions.reduce((a, b) => a + b.count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Páginas</p>
              <p className="text-2xl font-bold text-slate-900">{stats.mostAccessedPages.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Páginas Mais Acessadas</h2>
          </div>
          <div className="space-y-3">
            {stats.mostAccessedPages.length === 0 && (
              <p className="text-sm text-slate-400">Nenhum dado disponível</p>
            )}
            {stats.mostAccessedPages.map((item, i) => (
              <div key={item.page} className="flex items-center justify-between">
                <span className="text-sm text-slate-700 font-medium">{item.page}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.count / Math.max(...stats.mostAccessedPages.map((p) => p.count))) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MousePointerClick className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Ações Mais Usadas</h2>
          </div>
          <div className="space-y-3">
            {stats.mostUsedActions.length === 0 && (
              <p className="text-sm text-slate-400">Nenhum dado disponível</p>
            )}
            {stats.mostUsedActions.map((item, i) => {
              const actionLabels: Record<string, string> = {
                view: 'Visualização',
                create: 'Criação',
                update: 'Edição',
                delete: 'Exclusão',
              };
              return (
                <div key={item.action} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">
                    {actionLabels[item.action] || item.action}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.count / Math.max(...stats.mostUsedActions.map((a) => a.count))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-500 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
