import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Pencil, CheckCircle2,
  X, Search, AlertTriangle, DollarSign,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useProductStore } from '../hooks/useProductStore';
import type { ProductInput } from '../hooks/useProductStore';
import { useCategoryStore } from '../../categories/hooks/useCategoryStore';
import type { Product } from '../../../types/domain';

const EMPTY_EDIT = {
  name:              '',
  sku:               '',
  category_id:       '' as string,
  description:       '',
  cost_price:        '',
  sale_price:        '',
  min_price:         '',
  tax_rate:          '0',
  price_includes_tax: false,
  type:              'other' as 'physical' | 'service' | 'digital' | 'composite' | 'other',
  has_variants:      false,
  min_stock:         '5',
  unit:              'unidades',
  is_active:         true,
  track_inventory:   true,
};

type EditForm = typeof EMPTY_EDIT;

const UNITS = [
  { value: 'unidades', label: 'Unidades (pz)' },
  { value: 'kg',       label: 'Kilogramos (kg)' },
  { value: 'g',        label: 'Gramos (g)' },
  { value: 'l',        label: 'Litros (l)' },
  { value: 'ml',       label: 'Mililitros (ml)' },
  { value: 'm',        label: 'Metros (m)' },
  { value: 'caja',     label: 'Caja' },
  { value: 'paquete',  label: 'Paquete' },
];


function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, isLoading, error, update, toggleActive } = useProductStore();
  const { categories } = useCategoryStore();

  const [search, setSearch]             = useState('');
  const [editing, setEditing]           = useState<Product | null>(null);
  const [form, setForm]                 = useState<EditForm>(EMPTY_EDIT);
  const [toast, setToast]               = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() =>
    products.filter(p =>
      (p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category ?? '').toLowerCase().includes(search.toLowerCase())
    ), [products, search]);

  const activeCount   = products.filter(p => p.is_active).length;
  const inactiveCount = products.length - activeCount;

  const margin = useMemo(() => {
    const cost = parseFloat(form.cost_price);
    const sale = parseFloat(form.sale_price);
    if (cost > 0 && sale > 0) return ((sale - cost) / sale) * 100;
    return null;
  }, [form.cost_price, form.sale_price]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function openEdit(product: Product) {
    setForm({
      name:               product.name,
      sku:                product.sku ?? '',
      category_id:        String(product.category_id ?? ''),
      description:        product.description ?? '',
      cost_price:         String(product.cost_price),
      sale_price:         String(product.sale_price),
      min_price:          String(product.min_price ?? ''),
      tax_rate:           String(product.tax_rate ?? '0'),
      price_includes_tax: product.price_includes_tax ?? false,
      type:               product.type ?? 'other',
      has_variants:       product.has_variants ?? false,
      min_stock:          String(product.min_stock ?? '5'),
      unit:               product.unit ?? 'unidades',
      is_active:          product.is_active,
      track_inventory:    product.track_inventory ?? true,
    });
    setEditing(product);
  }

  function closeModal() { setEditing(null); }

  function setField<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function buildPayload(): ProductInput {
    return {
      name:               form.name.trim(),
      category_id:        form.category_id !== '' ? form.category_id : undefined,
      sku:                form.sku.trim()         || undefined,
      description:        form.description.trim() || undefined,
      cost_price:         parseFloat(form.cost_price)  || 0,
      sale_price:         parseFloat(form.sale_price)  || 0,
      min_price:          parseFloat(form.min_price)   || undefined,
      price_includes_tax: form.price_includes_tax,
      tax_rate:           parseFloat(form.tax_rate)    || 0,
      type:               form.type,
      has_variants:       form.has_variants,
      min_stock:          parseInt(form.min_stock, 10) || 0,
      unit:               form.unit,
      is_active:          form.is_active,
      track_inventory:    form.track_inventory,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !form.name.trim()) return;
    setIsSubmitting(true);
    try {
      await update(editing.id, buildPayload());
      showToast('Producto actualizado correctamente');
      closeModal();
    } catch {
      showToast('Ocurrió un error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const inputCls = 'block w-full px-4 h-11 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm';
  const labelCls = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Encabezado ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Productos</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">Gestiona el catálogo de productos</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/products/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm shadow-blue-200 dark:shadow-none transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </button>
        </motion.div>

        {/* ── Tarjetas resumen ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: 'Total',     value: products.length, color: 'text-slate-700 dark:text-slate-200',     bg: 'bg-slate-100 dark:bg-slate-700' },
            { label: 'Activos',   value: activeCount,     color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
            { label: 'Inactivos', value: inactiveCount,   color: 'text-rose-700 dark:text-rose-300',       bg: 'bg-rose-50 dark:bg-rose-900/30' },
          ].map(card => (
            <motion.div
              key={card.label}
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 text-center"
            >
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Buscador ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-11 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </motion.div>

        {/* ── Tabla ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Cargando productos...</p>
            </div>
          ) : (
          <>
          {error && (
            <div className="flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium text-slate-500 dark:text-slate-400">
                {search ? 'Sin resultados para tu búsqueda' : 'No hay productos aún'}
              </p>
              {!search && (
                <button
                  onClick={() => navigate('/products/new')}
                  className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Crear el primer producto
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Encabezado desktop */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_130px_90px_100px_72px] gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Producto</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Categoría</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Precio venta</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Stock</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Estado</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Acción</span>
              </div>

              <AnimatePresence initial={false}>
                {filtered.map(product => {
                  const safeName = product.name ?? '';
                  const initial  = safeName.charAt(0).toUpperCase() || '?';
                  const hue      = safeName.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
                  const avatarStyle = { backgroundColor: `hsl(${hue},55%,88%)`, color: `hsl(${hue},55%,35%)` };
                  const lowStock = product.track_inventory && (product.stock ?? 0) <= (product.min_stock ?? 0);

                  return (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_130px_90px_100px_72px] gap-3 sm:gap-4 items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 hover:bg-blue-50/30 dark:hover:bg-slate-700/20 transition-colors group"
                    >
                      {/* Nombre + SKU */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm"
                          style={avatarStyle}
                        >
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">{safeName}</p>
                          {product.sku && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{product.sku}</p>
                          )}
                          {/* Info visible solo en móvil */}
                          <div className="flex sm:hidden flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                            {product.category && (
                              <span className="text-xs text-slate-400 dark:text-slate-500">{product.category}</span>
                            )}
                            <span className={`text-xs font-medium ${lowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              Stock: {product.stock}
                            </span>
                            <span className={`text-xs font-medium ${product.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                              {product.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Categoría */}
                      <div className="hidden sm:flex items-center">
                        {product.category
                          ? <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{product.category}</span>
                          : <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                        }
                      </div>

                      {/* Precio venta */}
                      <div className="hidden sm:flex items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {formatCurrency(product.sale_price ?? 0)}
                        </span>
                      </div>

                      {/* Stock */}
                      <div className="hidden sm:flex items-center">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${lowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                          {lowStock && <AlertTriangle className="w-3.5 h-3.5" />}
                          {product.stock}
                        </span>
                      </div>

                      {/* Estado */}
                      <div className="hidden sm:flex items-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          product.is_active
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-500'}`} />
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(product)}
                          title="Editar"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          title={product.is_active ? 'Inactivar' : 'Activar'}
                          onClick={async () => {
                            const accion = product.is_active ? 'inactivar' : 'activar';
                            const { isConfirmed } = await Swal.fire({
                              title: `¿${product.is_active ? 'Inactivar' : 'Activar'} producto?`,
                              text:  `Vas a ${accion} "${product.name}". ¿Deseas continuar?`,
                              icon:  product.is_active ? 'warning' : 'question',
                              showCancelButton:   true,
                              confirmButtonText:  `Sí, ${accion}`,
                              cancelButtonText:   'Cancelar',
                              confirmButtonColor: product.is_active ? '#f59e0b' : '#10b981',
                              cancelButtonColor:  '#64748b',
                            });
                            if (!isConfirmed) return;
                            try {
                              await toggleActive(product.id, product.is_active);
                              showToast(`Producto ${product.is_active ? 'inactivado' : 'activado'} correctamente`);
                            } catch {
                              showToast('Error al cambiar el estado');
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            product.is_active
                              ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                          }`}
                        >
                          {product.is_active
                            ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                            : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                          }
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
          </>)}
        </motion.div>
      </main>

      {/* ── Modal editar ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/40 backdrop-blur-sm overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden mb-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <Package className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Editar producto</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                {/* Nombre + SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Nombre <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={form.name}
                      onChange={e => setField('name', e.target.value)}
                      placeholder="Ej: Harina de trigo 1kg"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>SKU / Código <span className="text-slate-400 font-normal">(opcional)</span></label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={e => setField('sku', e.target.value)}
                      placeholder="Ej: HAR-001"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Categoría</label>
                    <select
                      value={form.category_id}
                      onChange={e => setField('category_id', e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Sin categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className={labelCls}>Descripción <span className="text-slate-400 font-normal">(opcional)</span></label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    placeholder="Breve descripción del producto..."
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none text-sm"
                  />
                </div>

                {/* Precios */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Precios</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Precio de costo <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input type="number" required min="0" step="0.01"
                          value={form.cost_price}
                          onChange={e => setField('cost_price', e.target.value)}
                          placeholder="0"
                          className={`${inputCls} pl-7`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Precio de venta <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input type="number" required min="0" step="0.01"
                          value={form.sale_price}
                          onChange={e => setField('sale_price', e.target.value)}
                          placeholder="0"
                          className={`${inputCls} pl-7`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Precio mínimo</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input type="number" min="0" step="0.01"
                          value={form.min_price}
                          onChange={e => setField('min_price', e.target.value)}
                          placeholder="0"
                          className={`${inputCls} pl-7`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Tasa de impuesto (%)</label>
                      <input type="number" min="0" max="100" step="0.01"
                        value={form.tax_rate}
                        onChange={e => setField('tax_rate', e.target.value)}
                        placeholder="0"
                        className={inputCls}
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <div className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm ${
                        margin === null
                          ? 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                          : margin < 0
                            ? 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20'
                            : margin < 20
                              ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                              : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                      }`}>
                        <span className="text-slate-500 dark:text-slate-400">Margen</span>
                        <span className={`font-bold ${
                          margin === null ? 'text-slate-400' : margin < 0 ? 'text-rose-600' : margin < 20 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {margin !== null ? `${margin.toFixed(1)}%` : '--%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tipo + Inventario */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Tipo</label>
                    <select value={form.type} onChange={e => setField('type', e.target.value as 'physical' | 'service' | 'digital' | 'composite' | 'other')} className={inputCls}>
                      <option value="physical">Físico</option>
                      <option value="service">Servicio</option>
                      <option value="digital">Digital</option>
                      <option value="composite">Compuesto</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Stock mínimo</label>
                    <input type="number" min="0"
                      value={form.min_stock}
                      onChange={e => setField('min_stock', e.target.value)}
                      placeholder="5"
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Unidad</label>
                    <select value={form.unit} onChange={e => setField('unit', e.target.value)} className={inputCls}>
                      {UNITS.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2">
                  {([
                    { key: 'is_active'         as const, label: 'Producto activo',          desc: 'Disponible para venta y movimientos' },
                    { key: 'track_inventory'   as const, label: 'Rastrear inventario',      desc: 'Descontar stock al vender' },
                    { key: 'price_includes_tax' as const, label: 'Precio incluye impuesto', desc: 'El precio de venta ya incluye el impuesto' },
                    { key: 'has_variants'      as const, label: 'Tiene variantes',          desc: 'El producto tiene variantes como talla, color, etc.' },
                  ]).map(({ key, label, desc }) => (
                    <div
                      key={key}
                      onClick={() => setField(key, !form[key])}
                      className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <div className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${form[key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting || !form.name.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Guardar cambios'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
          >
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
