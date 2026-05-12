import { useState, useRef, useEffect } from 'react';
import { X, Package, DollarSign, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts, MockProduct } from '../data/mockProducts';

export interface SaleLine {
  id: string;
  name: string;
  stock: number;
  quantity: number;
  unitPrice: number;
}

interface SaleLineItemProps {
  item: SaleLine;
  index: number;
  onChange: (id: string, field: keyof SaleLine, value: string | number) => void;
  onRemove: (id: string) => void;
  onProductSelect: (lineId: string, product: MockProduct) => void;
  canRemove: boolean;
}

export function SaleLineItem({ item, onChange, onRemove, onProductSelect, canRemove }: SaleLineItemProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const subtotal = item.quantity * item.unitPrice;
  const isStockLow = item.stock > 0 && item.stock < 10;
  const isQuantityInvalid = item.stock > 0 && item.quantity > item.stock;

  const filtered = item.name.trim().length === 0
    ? []
    : mockProducts.filter(p =>
        p.name.toLowerCase().includes(item.name.toLowerCase()) ||
        p.sku.toLowerCase().includes(item.name.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setShowDropdown(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: showDropdown ? 10 : 'auto', position: 'relative' }}
      className={`p-4 rounded-lg border mb-3 group ${isQuantityInvalid ? 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20' : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'}`}>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start sm:items-center">
        {/* Product Name with Dropdown */}
        <div className="sm:col-span-4">
          <label
            htmlFor={`product-${item.id}`}
            className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            Producto
          </label>
          <div className="relative" ref={wrapperRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Package className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id={`product-${item.id}`}
              value={item.name}
              onChange={(e) => {
                onChange(item.id, 'name', e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => { if (item.name.trim()) setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar producto..."
              style={{ paddingLeft: '2.5rem' }}
              className="block w-full pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" />

            <AnimatePresence>
              {showDropdown && filtered.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden"
                  style={{ zIndex: 50 }}>
                  {filtered.map(product => (
                    <li
                      key={product.id}
                      onMouseDown={() => {
                        onProductSelect(item.id, product);
                        setShowDropdown(false);
                      }}
                      className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.sku} · {product.category}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${product.stock === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : product.stock < 10 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                          {product.stock} uds
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stock Display */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">
            Stock
          </label>
          <div
            className={`flex items-center px-3 py-2 border rounded-lg text-sm ${isStockLow ? 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'}`}>
            <Archive className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
            <span>{item.stock}</span>
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
            max={item.stock}
            value={item.quantity || ''}
            onChange={(e) => onChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
            placeholder="0"
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 transition-shadow ${isQuantityInvalid ? 'border-rose-300 dark:border-rose-700 focus:ring-rose-500 focus:border-rose-500 text-rose-900 dark:text-rose-300 bg-white dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100'}`} />

          {isQuantityInvalid &&
            <p className="text-[10px] text-rose-600 mt-1 absolute sm:static">
              Excede stock
            </p>
          }
        </div>

        {/* Unit Price */}
        <div className="sm:col-span-2">
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
    </motion.div>
  );
}
