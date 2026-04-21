import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, LayoutDashboard, Send, Receipt, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import ThemeToggle from '../ui/ThemeToggle';
import logoDark  from '../../assets/img/logo-dark.png';
import logoLight from '../../assets/img/logo-light.png';

const navLinks = [
  { label: 'Dashboard',        icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Registrar venta',  icon: Send,            path: '/sales/new' },
  { label: 'Registrar pago',   icon: Receipt,         path: '/payments/new' },
  { label: 'Nuevo producto',   icon: Plus,            path: '/products/new' },
  { label: 'Reportes',         icon: BarChart3,       path: '/reports' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logo = isDark ? logoDark : logoLight;

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const fullName = user ? `${user.first_name} ${user.last_name}` : '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* ── NAVBAR ── */}
      <header className="
        sticky top-0 z-50
        bg-white dark:bg-[#17232F]
        border-b border-slate-200 dark:border-slate-700
        shadow-sm
        transition-colors duration-300
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center shrink-0"
          >
            <img
              src={logo}
              alt="Kardex CO"
              className="h-11 w-auto object-contain transition-opacity duration-300"
            />
          </button>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 px-4">
            {navLinks.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {/* User avatar + name — desktop */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 ml-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                {fullName}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              title="Cerrar sesión"
              className="
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                text-slate-500 dark:text-slate-400
                hover:bg-red-50 dark:hover:bg-red-900/30
                hover:text-red-600 dark:hover:text-red-400
                border border-transparent hover:border-red-200 dark:hover:border-red-800
                transition-all duration-150
              "
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#17232F] px-4 py-3 space-y-1">
            {navLinks.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => { navigate(path); setMenuOpen(false); }}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${active
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                  `}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{fullName}</span>
            </div>
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ── */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
