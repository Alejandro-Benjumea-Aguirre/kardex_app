import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  ShoppingCart,
  CreditCard,
  Plus,
  Save,
  X,
  Package,
  Banknote,
  ArrowRightLeft,
  Clock,
  Calendar,
  User,
  Check } from
'lucide-react';
import { SaleLineItem, SaleLine } from '../features/sales/SaleLineItem';
import { SaleSummary } from '../features/sales/SaleSummary';

export default function RegisterSale() {
  // State Management
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [customer, setCustomer] = useState('occasional');
  const [saleType, setSaleType] = useState<'cash' | 'credit'>('cash');
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'transfer' | 'card' | 'credit'>(
    'cash');
  const [saleLines, setSaleLines] = useState<SaleLine[]>([
  {
    id: '1',
    name: '',
    stock: 25,
    quantity: 1,
    unitPrice: 0
  }]
  );
  // Handlers
  const handleAddProduct = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const randomStock = Math.floor(Math.random() * 50) + 1;
    setSaleLines([
    ...saleLines,
    {
      id: newId,
      name: '',
      stock: randomStock,
      quantity: 1,
      unitPrice: 0
    }]
    );
  };
  const handleRemoveProduct = (id: string) => {
    if (saleLines.length > 1) {
      setSaleLines(saleLines.filter((p) => p.id !== id));
    }
  };
  const handleProductChange = (
  id: string,
  field: keyof SaleLine,
  value: string | number) =>
  {
    setSaleLines(
      saleLines.map((p) =>
      p.id === id ?
      {
        ...p,
        [field]: value
      } :
      p
      )
    );
  };
  // Calculations
  const subtotal = saleLines.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalItems = saleLines.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 lg:pb-12">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">

          <button
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-full transition-colors self-start sm:self-auto"
            onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Registrar venta
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Registra los productos vendidos y el ingreso generado
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Información general
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Fecha de venta
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="block w-full pl-10 pr-3 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700" />
                  </div>
                </div>

                {/* Customer Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cliente
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="block w-full pl-10 pr-10 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 appearance-none bg-white dark:bg-slate-700">

                      <option value="occasional">Cliente ocasional</option>
                      <option value="maria">María García</option>
                      <option value="juan">Juan López</option>
                      <option value="tienda">Tienda El Sol</option>
                      <option value="roberto">Roberto Méndez</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sale Type - Full Width */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de venta
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSaleType('cash')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${saleType === 'cash' ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>

                      <Banknote className="w-4 h-4" />
                      Contado
                    </button>
                    <button
                      type="button"
                      onClick={() => setSaleType('credit')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${saleType === 'credit' ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>

                      <Clock className="w-4 h-4" />
                      Crédito
                    </button>
                  </div>
                </div>

                {/* Due Date - Conditional Animation */}
                <AnimatePresence>
                  {saleType === 'credit' &&
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="sm:col-span-2 overflow-hidden">

                      <div className="pt-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Fecha de vencimiento
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="block w-full pl-10 pr-3 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700" />
                        </div>
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Products Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Productos vendidos
                  </h2>
                </div>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  {saleLines.length}
                </span>
              </div>

              {/* Column Headers (Desktop Only) */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-4 mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="col-span-4">Producto</div>
                <div className="col-span-2">Stock</div>
                <div className="col-span-2">Cant.</div>
                <div className="col-span-2">Precio Unit.</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {saleLines.map((item, index) =>
                  <SaleLineItem
                    key={item.id}
                    item={item}
                    index={index}
                    onChange={handleProductChange}
                    onRemove={handleRemoveProduct}
                    canRemove={saleLines.length > 1} />
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddProduct}
                className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg text-blue-600 font-medium flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">

                <Plus className="w-5 h-5" />
                Agregar producto
              </motion.button>
            </motion.section>

            {/* Payment Method */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Forma de pago
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                { id: 'cash',     label: 'Efectivo',       icon: Banknote },
                { id: 'transfer', label: 'Transferencia',  icon: ArrowRightLeft },
                { id: 'card',     label: 'Tarjeta',        icon: CreditCard },
                { id: 'credit',   label: 'Crédito',        icon: Clock }].
                map((method) =>
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>

                    {paymentMethod === method.id &&
                  <div className="absolute top-2 right-2 text-blue-600">
                        <Check className="w-4 h-4" />
                      </div>
                  }
                    <method.icon
                    className={`w-6 h-6 mb-2 ${paymentMethod === method.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />

                    <span className="font-medium text-sm">{method.label}</span>
                  </button>
                )}
              </div>
            </motion.section>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex gap-4 pt-4">
              <button className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Guardar venta
              </button>
              <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </div>

          {/* Right Column - Summary Sidebar */}
          <div className="lg:col-span-1">
            <SaleSummary
              subtotal={subtotal}
              totalItems={totalItems}
              paymentMethod={paymentMethod}
              saleType={saleType} />
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 lg:hidden z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 max-w-6xl mx-auto">
          <button className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <button className="flex-[3] bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Guardar venta
          </button>
        </div>
      </div>
    </div>);
}
