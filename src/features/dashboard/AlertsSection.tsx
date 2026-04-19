import React from 'react';
import { AlertTriangle, Info, Target, ChevronRight } from 'lucide-react';
const alerts = [
{
  id: 1,
  title: 'Pago con tarjeta de crédito vence',
  description: 'Su pago de $1,250 vence en 3 días',
  type: 'warning',
  icon: AlertTriangle,
  colorClass: 'text-amber-600 bg-amber-50 border-amber-200'
},
{
  id: 2,
  title: 'Gasto inusual detectado',
  description: 'Gasto superior al promedio en la categoría "Salir a comer',
  type: 'info',
  icon: Info,
  colorClass: 'text-blue-600 bg-blue-50 border-blue-200'
},
{
  id: 3,
  title: 'Se acerca tu meta de ahorro',
  description: 'Has alcanzado el 80 % de tu meta de "Auto nuevo"',
  type: 'success',
  icon: Target,
  colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200'
}];

export function AlertsSection() {
  return (
    <section aria-label="Alerts and Notifications">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Alertas y Notificaciones
        </h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center">
          Ver todas <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) =>
        <div
          key={alert.id}
          className={`flex items-start p-4 rounded-lg border ${alert.colorClass} transition-opacity hover:opacity-90`}>

            <alert.icon className="w-5 h-5 mt-0.5 flex-shrink-0 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{alert.title}</h3>
              <p className="text-sm opacity-90 mt-1">{alert.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>);

}