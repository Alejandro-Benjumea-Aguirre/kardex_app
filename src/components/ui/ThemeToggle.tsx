import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="
        relative flex items-center justify-center
        w-10 h-10 rounded-xl
        bg-slate-100 hover:bg-slate-200
        dark:bg-slate-700 dark:hover:bg-slate-600
        text-slate-600 dark:text-slate-200
        border border-slate-200 dark:border-slate-600
        transition-all duration-200
        shadow-sm hover:shadow
      "
    >
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
        <Sun size={17} />
      </span>
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
        <Moon size={17} />
      </span>
    </button>
  );
};

export default ThemeToggle;
