import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Globe, Activity, Monitor, AlertTriangle, CheckCircle, XCircle, User, Smartphone } from 'lucide-react';
import { adminApi } from '../../services/api';
import type { AccessLogDetail } from '../../types';

const actionLabels: Record<string, string> = {
  view: 'Visualização',
  create: 'Criação',
  update: 'Edição',
  delete: 'Exclusão',
};

function parseUserAgent(ua: string | null) {
  if (!ua) return { browser: '-', os: '-', device: '-' };
  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\S+)/);
  const osMatch = ua.match(/\(([^)]+)\)/);
  const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : '-';
  const os = osMatch ? osMatch[1].split(';')[0].trim() : '-';
  const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop';
  return { browser, os, device };
}

export default function AdminAccessLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<AccessLogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    adminApi.getAccessLog(id)
      .then(setLog)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-slate-500">Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!log) return null;

  const ua = parseUserAgent(log.userAgent);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <h1 className="text-2xl font-bold text-slate-900">Detalhes do Acesso</h1>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {log.status === 'success'
              ? <CheckCircle className="w-5 h-5 text-green-700" />
              : <XCircle className="w-5 h-5 text-red-700" />
            }
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {actionLabels[log.action] || log.action}
            </p>
            <p className={`text-sm font-medium ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {log.status === 'success' ? 'Sucesso' : 'Erro'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data e Hora</p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(log.createdAt).toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuário</p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              {log.userName}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Página</p>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-mono">
              <Activity className="w-4 h-4 text-slate-400" />
              {log.page || '-'}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Endereço IP</p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Globe className="w-4 h-4 text-slate-400" />
              {log.ip || '-'}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dispositivo</p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              {ua.device === 'Mobile' ? <Smartphone className="w-4 h-4 text-slate-400" /> : <Monitor className="w-4 h-4 text-slate-400" />}
              {ua.device}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sistema Operacional</p>
            <p className="text-sm text-slate-700">{ua.os}</p>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navegador</p>
            <p className="text-sm text-slate-700 font-mono">{ua.browser}</p>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Agent</p>
            <p className="text-sm text-slate-500 font-mono text-xs break-all">{log.userAgent || '-'}</p>
          </div>
        </div>
      </div>

      {log.status === 'error' && log.errorMessage && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Detalhes do Erro</h2>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Mensagem</p>
            <p className="text-sm text-red-800 font-mono whitespace-pre-wrap break-all">{log.errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
