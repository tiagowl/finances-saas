import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tag,
  RefreshCw,
  DollarSign,
  Repeat,
  Folder,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses/occasional', label: 'Despesas Avulsas', icon: Tag },
  { to: '/expenses/recurring', label: 'Despesas Recorrentes', icon: RefreshCw },
  { to: '/revenues/occasional', label: 'Receitas Avulsas', icon: DollarSign },
  { to: '/revenues/recurring', label: 'Receitas Recorrentes', icon: Repeat },
  { to: '/categories', label: 'Categorias', icon: Folder },
  { to: '/profile', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40"
      aria-label="Navegação mobile"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-primary-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
