import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Shield, ChevronRight, Search } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { AdminUser } from '../../types';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.listUsers(search || undefined)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Nome</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Função</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-sm text-slate-400">Carregando...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="text-center py-8 text-sm text-red-500">{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-sm text-slate-400">Nenhum usuário encontrado</td></tr>
            ) : users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/admin/users/${user.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-teal-700" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className={`text-sm font-medium ${user.role === 'admin' ? 'text-teal-700' : 'text-slate-500'}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
