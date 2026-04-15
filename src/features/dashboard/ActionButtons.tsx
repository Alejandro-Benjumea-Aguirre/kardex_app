import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Receipt, Plus, BarChart3 } from 'lucide-react';

const actions = [
{
  label: 'Registrar venta',
  icon: Send,
  color: 'text-blue-600',
  borderColor: 'hover:border-blue-200',
  bgColor: 'hover:bg-blue-50',
  link: '/products/new'
},
{
  label: 'Registrar pago',
  icon: Receipt,
  color: 'text-rose-600',
  borderColor: 'hover:border-rose-200',
  bgColor: 'hover:bg-rose-50',
  link: '/sales/new'
},
{
  label: 'Registrar producto',
  icon: Plus,
  color: 'text-green-600',
  borderColor: 'hover:border-green-200',
  bgColor: 'hover:bg-green-50',
  link: '/payments/new'
},
{
  label: 'Reportes',
  icon: BarChart3,
  color: 'text-purple-600',
  borderColor: 'hover:border-purple-200',
  bgColor: 'hover:bg-purple-50',
  link: '/reports'
}];

export function ActionButtons() {
  const navigate = useNavigate();
  return (
    <section aria-label="Acciones" className="py-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) =>
        <button
          key={action.label}
          className={`
              flex flex-col items-center justify-center p-6
              bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl
              transition-all duration-200 group
              ${action.borderColor} ${action.bgColor}
            `}
          onClick={() => navigate(action.link)}>

            <div
            className={`p-3 rounded-full bg-slate-50 mb-3 group-hover:bg-white transition-colors ${action.color}`}>

              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
              {action.label}
            </span>
          </button>
        )}
      </div>
    </section>);

}