import React from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  TrendingUp,
  Archive,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Clock } from
'lucide-react';
interface SaleSummaryProps {
  subtotal: number;
  taxRate?: number;
  totalItems: number;
  paymentMethod: string;
  saleType: string;
}
export function SaleSummary({
  subtotal,
  taxRate = 0,
  totalItems,
  paymentMethod,
  saleType
}: SaleSummaryProps) {
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;
  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'cash':     return <Banknote className="w-3 h-3 mr-1" />;
      case 'transfer': return <ArrowRightLeft className="w-3 h-3 mr-1" />;
      case 'card':     return <CreditCard className="w-3 h-3 mr-1" />;
      case 'credit':   return <Clock className="w-3 h-3 mr-1" />;
      default:         return <CreditCard className="w-3 h-3 mr-1" />;
    }
  };
  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case 'cash':     return 'Efectivo';
      case 'transfer': return 'Transferencia';
      case 'card':     return 'Tarjeta';
      case 'credit':   return 'Crédito';
      default:         return 'Desconocido';
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sticky top-24">

      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
          <Calculator className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Resumen de venta</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
          <span>Subtotal ({totalItems} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {taxRate > 0 &&
        <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
            <span>Impuestos ({(taxRate * 100).toFixed(0)}%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        }

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-slate-900 dark:text-slate-100 font-medium">Total a cobrar</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Impact Badges */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-medium border border-amber-100 dark:border-amber-800">
            <Archive className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
            Inventario: -{totalItems} items
          </div>

          <div className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium border border-green-100 dark:border-green-800">
            <TrendingUp className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
            Impacto contable: Ingreso
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-600">
            <span className="flex items-center">
              {getPaymentIcon()}
              {getPaymentLabel()}
            </span>
            <span className="text-slate-400 dark:text-slate-500 capitalize">{saleType}</span>
          </div>
        </div>
      </div>
    </motion.div>);
}
