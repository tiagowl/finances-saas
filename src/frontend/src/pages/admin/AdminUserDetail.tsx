import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Shield, Calendar, Globe, Activity, Search, Filter } from 'lucide-react';
import { adminApi } from '../../services/api';
import Pagination from '../../components/shared/Pagination';
import type { UserDetailData } from '../../types';

const actionLabels: Record<string, string> = {
  view: 'Visualização',
  create: 'Criação',
  update: 'Edição',
  delete: 'Exclusão',
};

const actionOptions = [
  { value: '', label: 'Todas' },
  { value: 'view', label: 'Visualização' },
  { value: 'create', label: 'Criação' },
  { value: 'update', label: 'Edição' },
  { value: 'delete', label: 'Exclusão' },
];

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'success', label: 'Sucesso' },
  { value: 'error', label: 'Erro' },
];

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterAction, setFilterAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = () => {
    if (!id) return;
    setLoading(true);
    adminApi.getUser(id, {
      action: filterAction || undefined,
      status: filterStatus || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page,
      limit: 20,
    })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id, filterAction, filterStatus, startDate, endDate, page]);

  useEffect(() => {
    setPage(1);
  }, [filterAction, filterStatus, startDate, endDate]);

  if (loading && !data) return <div className="text-slate-500">Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para usuários
      </button>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{data.user.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="w-4 h-4" />
                {data.user.email}
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className={`font-medium ${data.user.role === 'admin' ? 'text-teal-700' : 'text-slate-500'}`}>
                  {data.user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Registro de Atividades ({data.totalAccesses} acessos)
          </h2>
          {loading && <span className="text-xs text-slate-400">(atualizando...)</span>}
        </div>

        <div className="flex flex-wrap gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {actionOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-400">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {data.accessLogs.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Nenhuma atividade registrada</p>
        )}

        {data.accessLogs.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Data</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Ação</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Página</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {data.accessLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/access-logs/${log.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {log.status === 'success' ? 'Sucesso' : 'Erro'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-600 font-mono">{log.page}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-500">{log.ip || '-'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} limit={20} total={data.totalAccesses} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
