import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Plus, Pencil, Trash2, CheckCircle2,
  X, Search, LayoutGrid, AlertTriangle,
} from 'lucide-react';
import { useCategoryStore } from '../hooks/useCategoryStore';
import { CATEGORY_COLORS } from '../data/mockCategories';
import type { Category } from '../../../types/domain';

type ModalMode = 'create' | 'edit' | null;

const EMPTY_FORM = { name: '', description: '', color: '#3b82f6', is_active: true, has_parent: false, parent_id: null as number | null };

export default function CategoriesPage() {
  const { categories, add, update, remove, toggleActive } = useCategoryStore();

  const [search, setSearch]           = useState('');
  const [modalMode, setModalMode]     = useState<ModalMode>(null);
  const [editing, setEditing]         = useState<Category | null>(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [toast, setToast]             = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = categories.filter(c => c.is_active).length;
  const inactiveCount = categories.length - activeCount;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setModalMode('create');
  }

  function openEdit(cat: Category) {
    setForm({
      name:       cat.name,
      description: cat.description ?? '',
      color:      cat.color,
      is_active:  cat.is_active,
      has_parent: cat.parent_id != null,
      parent_id:  cat.parent_id ?? null,
    });
    setEditing(cat);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditing(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const parent_id = form.has_parent && form.parent_id ? form.parent_id : undefined;
      if (modalMode === 'create') {
        add({ name: form.name, description: form.description, color: form.color, parent_id });
        showToast('Categoría creada correctamente');
      } else if (editing) {
        update(editing.id, { ...form, parent_id });
        showToast('Categoría actualizada correctamente');
      }
      setIsSubmitting(false);
      closeModal();
    }, 600);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    setDeleteTarget(null);
    showToast('Categoría eliminada');
  }

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Encabezado ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Categorías
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">
                Gestiona las categorías de tus productos
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm shadow-blue-200 dark:shadow-none transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva categoría
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
            { label: 'Total',     value: categories.length, color: 'text-slate-700 dark:text-slate-200',   bg: 'bg-slate-100 dark:bg-slate-700' },
            { label: 'Activas',   value: activeCount,        color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
            { label: 'Inactivas', value: inactiveCount,      color: 'text-rose-700 dark:text-rose-300',     bg: 'bg-rose-50 dark:bg-rose-900/30' },
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
            placeholder="Buscar categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-11 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </motion.div>

        {/* ── Tabla de categorías ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <Tag className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium text-slate-500 dark:text-slate-400">
                {search ? 'Sin resultados para tu búsqueda' : 'No hay categorías aún'}
              </p>
              {!search && (
                <button
                  onClick={openCreate}
                  className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  Crear la primera categoría
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Encabezado tabla — solo desktop */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span>Color</span>
                <span>Nombre / Descripción</span>
                <span>Slug</span>
                <span>Categoría padre</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>

              <AnimatePresence initial={false}>
                {filtered.map(cat => {
                  const parent = cat.parent_id ? categories.find(c => c.id === cat.parent_id) : null;
                  return (
                  <motion.div
                    key={cat.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-slate-50 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    {/* Color dot */}
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />

                    {/* Nombre + descripción + padre (móvil) */}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{cat.name}</p>
                      {cat.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{cat.description}</p>
                      )}
                      {parent && (
                        <div className="flex sm:hidden items-center gap-1 mt-1">
                          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: parent.color }} />
                          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{parent.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Slug */}
                    <span className="hidden sm:block text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {cat.slug}
                    </span>

                    {/* Categoría padre */}
                    <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                      {parent ? (
                        <>
                          <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: parent.color }} />
                          <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{parent.name}</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </div>

                    {/* Toggle estado */}
                    <button
                      onClick={() => { toggleActive(cat.id); showToast(`Categoría ${cat.is_active ? 'desactivada' : 'activada'}`); }}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        cat.is_active
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {cat.is_active ? 'Activa' : 'Inactiva'}
                    </button>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        title="Editar"
                        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        title="Eliminar"
                        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </main>

      {/* ── Modal crear / editar ── */}
      <AnimatePresence>
        {modalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              {/* Header modal */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {modalMode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body modal */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ej: Electrónica"
                    className="block w-full px-4 h-11 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descripción <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Breve descripción de la categoría..."
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none text-sm"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Color identificador
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        title={label}
                        onClick={() => setForm(f => ({ ...f, color: value }))}
                        className={`w-8 h-8 rounded-lg transition-all ${form.color === value ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-800 scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Categoría padre */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={form.has_parent}
                        onChange={e => setForm(f => ({ ...f, has_parent: e.target.checked, parent_id: e.target.checked ? f.parent_id : null }))}
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.has_parent ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 group-hover:border-blue-400'}`}>
                        {form.has_parent && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Tiene categoría padre</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Esta categoría pertenece a una categoría existente</p>
                    </div>
                  </label>

                  <AnimatePresence>
                    {form.has_parent && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <select
                          value={form.parent_id ?? ''}
                          onChange={e => setForm(f => ({ ...f, parent_id: e.target.value ? Number(e.target.value) : null }))}
                          className="block w-full px-4 h-11 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-sm"
                        >
                          <option value="" disabled>Seleccionar categoría padre</option>
                          {categories
                            .filter(c => c.id !== editing?.id)
                            .map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                          }
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Estado (solo en edición) */}
                {modalMode === 'edit' && (
                  <div
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Categoría activa</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Visible en la creación de productos</p>
                    </div>
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 space-y-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ backgroundColor: form.color }} />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {form.name || 'Vista previa'}
                      </span>
                      {form.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{form.description}</p>
                      )}
                    </div>
                  </div>
                  {form.has_parent && form.parent_id && (() => {
                    const parent = categories.find(c => c.id === form.parent_id);
                    return parent ? (
                      <div className="flex items-center gap-1.5 pl-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500">Padre:</span>
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: parent.color }} />
                        <span className="text-xs text-slate-600 dark:text-slate-300">{parent.name}</span>
                      </div>
                    ) : null;
                  })()}
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
                      : modalMode === 'create' ? 'Crear categoría' : 'Guardar cambios'
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

      {/* ── Modal confirmar eliminación ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Eliminar categoría</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                ¿Estás seguro de que deseas eliminar la categoría{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">"{deleteTarget.name}"</span>?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-6">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
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
