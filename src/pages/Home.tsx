import React from 'react';
import { SummaryCards } from '../features/dashboard/SummaryCards';
import { ActionButtons } from '../features/dashboard/ActionButtons';
import { MonthlyChart } from '../features/dashboard/MonthlyChart';
import { AlertsSection } from '../features/dashboard/AlertsSection';

export default function Home() {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Menu Principal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{today}</p>
          </div>
        </div>
        <ActionButtons />

        {/* Dashboard Content */}
        <div className="space-y-8">
          <SummaryCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <MonthlyChart />
              
            </div>
            <div className="lg:col-span-1">
              <AlertsSection />

              {/* Recent Activity Mini-List (Bonus for layout balance) */}
              <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Actividad reciente
                </h3>
                <div className="space-y-4">
                  {[
                  {
                    name: 'Pago Renta',
                    date: 'Hoy',
                    amount: '-$1.200.000'
                  },
                  {
                    name: 'Ventas del Almuerzos',
                    date: 'Ayer',
                    amount: '+$500.000',
                    positive: true
                  },
                  {
                    name: 'Ventas de Helados',
                    date: 'Ayer',
                    amount: '+80.000',
                    positive: true
                  }].
                  map((item, i) =>
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm">

                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">
                          {item.name}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">{item.date}</p>
                      </div>
                      <span
                      className={`font-medium ${item.positive ? 'text-green-600' : 'text-red-400'}`}>

                        {item.amount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
