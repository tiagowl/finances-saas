import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Tag,
  RefreshCw,
  DollarSign,
  Repeat,
  Folder,
  LogOut,
  BarChart3,
  Users,
  Shield,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const mainNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses/occasional', label: 'Desp. Avulsas', icon: Tag },
  { to: '/expenses/recurring', label: 'Desp. Recorrentes', icon: RefreshCw },
  { to: '/revenues/occasional', label: 'Rec. Avulsas', icon: DollarSign },
  { to: '/revenues/recurring', label: 'Rec. Recorrentes', icon: Repeat },
  { to: '/categories', label: 'Categorias', icon: Folder },
  { to: '/profile', label: 'Perfil', icon: User },
];

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard Admin', icon: BarChart3 },
  { to: '/admin/users', label: 'Usuários', icon: Users },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="text-lg font-bold text-slate-900">Finances</span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">beta</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto" aria-label="Navegação principal">
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Páginas Principais
          </p>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {user?.role === 'admin' && (
          <div>
            <div className="flex items-center gap-2 px-3 mb-2">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Administrador
              </p>
            </div>
            <div className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
