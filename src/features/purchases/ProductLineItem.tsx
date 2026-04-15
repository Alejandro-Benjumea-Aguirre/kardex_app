import React from 'react';
import { X, Package, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
export interface ProductLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}
interface ProductLineItemProps {
  item: ProductLine;
  index: number;
  onChange: (id: string, field: keyof ProductLine, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}
export function ProductLineItem({
  item,
  index,
  onChange,
  onRemove,
  canRemove
}: ProductLineItemProps) {
  const subtotal = item.quantity * item.unitPrice;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 mb-3 group relative">

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start sm:items-center">
        {/* Product Name */}
        <div className="sm:col-span-5">
          <label
            htmlFor={`product-${item.id}`}
            className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            Producto
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id={`product-${item.id}`}
              value={item.name}
              onChange={(e) => onChange(item.id, 'name', e.target.value)}
              placeholder="Nombre del producto"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
        </div>

        {/* Quantity */}
        <div className="sm:col-span-2">
          <label
            htmlFor={`qty-${item.id}`}
            className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            Cant.
          </label>
          <input
            type="number"
            id={`qty-${item.id}`}
            min="1"
            value={item.quantity || ''}
            onChange={(e) => onChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
        </div>

        {/* Unit Price */}
        <div className="sm:col-span-3">
          <label
            htmlFor={`price-${item.id}`}
            className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            Precio Unit.
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-3 w-3 text-slate-400" />
            </div>
            <input
              type="number"
              id={`price-${item.id}`}
              min="0"
              step="0.01"
              value={item.unitPrice || ''}
              onChange={(e) => onChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="block w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
          </div>
        </div>

        {/* Subtotal & Remove */}
        <div className="sm:col-span-2 flex justify-between items-center">
          <div className="flex flex-col sm:items-end w-full">
            <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">Subtotal</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {canRemove &&
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="ml-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-colors"
            aria-label="Eliminar producto">
              <X className="h-4 w-4" />
            </button>
          }
        </div>
      </div>
    </motion.div>);
}
