import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';

const data = [
{
  name: 'Jan',
  income: 6500,
  expenses: 4200
},
{
  name: 'Feb',
  income: 7200,
  expenses: 4800
},
{
  name: 'Mar',
  income: 6800,
  expenses: 5100
},
{
  name: 'Apr',
  income: 8100,
  expenses: 4900
},
{
  name: 'May',
  income: 7900,
  expenses: 5300
},
{
  name: 'Jun',
  income: 8350,
  expenses: 5420
}];

export function MonthlyChart() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const gridColor   = isDark ? '#334155' : '#e2e8f0';
  const tickColor   = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg   = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const cursorFill  = isDark ? '#1e3a5f' : '#f1f5f9';

  return (
    <section
      aria-label="Monthly Financial Overview"
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Resumen financiero
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ingresos vs. Gastos en los últimos 6 meses
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            Ingresos
          </span>
          <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="w-3 h-3 rounded-full bg-rose-500 mr-1"></span>
            Gastos
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip
              cursor={{ fill: cursorFill }}
              contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: `1px solid ${tooltipBorder}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)' }}
              labelStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }}
              itemStyle={{ color: isDark ? '#cbd5e1' : '#475569' }}
            />
            <Bar dataKey="income"   fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} name="Ingresos" />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}