import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/expenses/occasional': 'Despesas Avulsas',
  '/expenses/recurring': 'Despesas Recorrentes',
  '/revenues/occasional': 'Receitas Avulsas',
  '/revenues/recurring': 'Receitas Recorrentes',
  '/categories': 'Categorias',
  '/profile': 'Meu Perfil',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const title = pageTitles[location.pathname] || 'Finances';
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isDashboard && (
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          {isDashboard && (
            <div className="w-7 h-7 rounded-md bg-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
          )}
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
