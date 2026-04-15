import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Package,
  Settings,
  Image as ImageIcon,
  Save,
  X,
  AlertCircle,
  CheckCircle2 } from
'lucide-react';
import { ImageUpload } from '../components/ui/ImageUpload';

export default function CreateProduct() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    description: '',
    purchasePrice: '',
    salePrice: '',
    tax: '0',
    initialStock: '',
    minStock: '',
    unit: 'unidades',
    isActive: true,
    trackInventory: true
  });
  const [margin, setMargin] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const purchase = parseFloat(formData.purchasePrice);
    const sale = parseFloat(formData.salePrice);
    if (purchase > 0 && sale > 0) {
      setMargin((sale - purchase) / sale * 100);
    } else {
      setMargin(null);
    }
  }, [formData.purchasePrice, formData.salePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleToggle = (field: 'isActive' | 'trackInventory') => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 lg:pb-12">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">

          <button
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-full transition-colors self-start sm:self-auto"
            onClick={() => navigate('/')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Crear producto
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Registra un nuevo producto en tu inventario
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6">

            {/* Section 1: Basic Information */}
            <motion.section
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Información básica
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nombre del producto <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Harina de trigo 1kg"
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Categoría <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700">

                    <option value="" disabled>Seleccionar categoría</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="limpieza">Limpieza</option>
                    <option value="electronica">Electrónica</option>
                    <option value="ropa">Ropa</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    SKU / Código interno
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ej: HAR-001"
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Opcional - código interno de referencia
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe brevemente el producto..."
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none" />
                </div>
              </div>
            </motion.section>

            {/* Section 2: Pricing */}
            <motion.section
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Precios</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="purchasePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Precio de compra <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="purchasePrice"
                      name="purchasePrice"
                      required
                      min="0"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="block w-full pl-8 pr-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="salePrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Precio de venta <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400">$</span>
                    </div>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      required
                      min="0"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="block w-full pl-8 pr-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                  </div>
                </div>

                {/* Margin Indicator */}
                <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center justify-between border border-slate-100 dark:border-slate-600">
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Margen de ganancia
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Calculado automáticamente
                    </p>
                  </div>
                  <div
                    className={`text-lg font-bold ${margin === null ? 'text-slate-400 dark:text-slate-500' : margin < 0 ? 'text-rose-600' : margin < 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {margin !== null ? `${margin.toFixed(1)}%` : '--%'}
                  </div>
                </div>

                <div>
                  <label htmlFor="tax" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Impuesto
                  </label>
                  <select
                    id="tax"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700">

                    <option value="0">Exento (0%)</option>
                    <option value="16">IVA General (16%)</option>
                    <option value="8">IVA Fronterizo (8%)</option>
                  </select>
                </div>
              </div>
            </motion.section>

            {/* Section 3: Inventory */}
            <motion.section
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Inventario</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="initialStock" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Stock inicial
                  </label>
                  <input
                    type="number"
                    id="initialStock"
                    name="initialStock"
                    min="0"
                    value={formData.initialStock}
                    onChange={handleChange}
                    placeholder="0"
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                </div>

                <div>
                  <label htmlFor="minStock" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Stock mínimo
                  </label>
                  <input
                    type="number"
                    id="minStock"
                    name="minStock"
                    min="0"
                    value={formData.minStock}
                    onChange={handleChange}
                    placeholder="5"
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Para alertas de inventario bajo
                  </p>
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Unidad de medida
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="block w-full px-4 h-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700">

                    <option value="unidades">Unidades (pz)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="g">Gramos (g)</option>
                    <option value="l">Litros (l)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="m">Metros (m)</option>
                    <option value="caja">Caja</option>
                    <option value="paquete">Paquete</option>
                  </select>
                </div>
              </div>
            </motion.section>

            {/* Section 4: Status and Settings */}
            <motion.section
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <Settings className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Configuración
                </h2>
              </div>

              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => handleToggle('isActive')}>

                  <div>
                    <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                      Producto activo
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Disponible para venta y movimientos
                    </span>
                  </div>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => handleToggle('trackInventory')}>

                  <div>
                    <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                      Rastrear inventario
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Descontar stock automáticamente al vender
                    </span>
                  </div>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.trackInventory ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.trackInventory ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 5: Optional Media */}
            <motion.section
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">

              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Imagen (Opcional)
                </h2>
              </div>

              <ImageUpload />
            </motion.section>

            {/* Action Buttons - Desktop */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex gap-4 pt-4">

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">

                {isSubmitting ?
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                <>
                    <Save className="w-5 h-5" />
                    Guardar producto
                  </>
                }
              </button>
              <button
                type="button"
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">

                <X className="w-5 h-5" />
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        </form>
      </main>

      {/* Mobile Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 lg:hidden z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <button
            type="button"
            className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[3] bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">

            {isSubmitting ?
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
            <>
                <Save className="w-5 h-5" />
                Guardar producto
              </>
            }
          </button>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess &&
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">

            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Producto guardado correctamente</span>
          </motion.div>
        }
      </AnimatePresence>
    </div>);
}
