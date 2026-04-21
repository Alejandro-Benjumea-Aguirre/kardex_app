import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  colorClass: string;
  iconColorClass: string;
}
const metrics = [
{
  title: 'Balance general',
  amount: '$24,563.00',
  change: '+2.5%',
  isPositive: true,
  icon: Wallet,
  colorClass: 'bg-blue-50',
  iconColorClass: 'text-blue-600'
},
{
  title: 'Ventas del mes',
  amount: '$8,350.00',
  change: '+12.3%',
  isPositive: true,
  icon: TrendingUp,
  colorClass: 'bg-green-50',
  iconColorClass: 'text-green-600'
},
{
  title: 'Gastos del mes',
  amount: '$5,420.00',
  change: '-3.2%',
  isPositive: true,
  icon: TrendingDown,
  colorClass: 'bg-red-50',
  iconColorClass: 'text-red-600'
},
{
  title: 'Porcentaje de ahorro',
  amount: '35.1%',
  change: '+5.8%',
  isPositive: true,
  icon: PiggyBank,
  colorClass: 'bg-purple-50',
  iconColorClass: 'text-purple-600'
}];

export function SummaryCards() {
  return (
    <section aria-label="Financial Summary">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) =>
        <div
          key={metric.title}
          className={`${metric.colorClass} dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02] duration-200`}>

            <div className="flex justify-between items-start mb-4">
              <div
              className={`p-2 rounded-lg bg-white/60 ${metric.iconColorClass}`}>

                <metric.icon className="w-6 h-6" />
              </div>
              <div
              className={`flex items-center text-xs font-medium px-2 py-1 rounded-full bg-white/60 ${metric.isPositive ? 'text-green-700' : 'text-red-700'}`}>

                {metric.isPositive ?
              <ArrowUpRight className="w-3 h-3 mr-1" /> :

              <ArrowDownRight className="w-3 h-3 mr-1" />
              }
                {metric.change}
              </div>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {metric.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {metric.amount}
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>);

}