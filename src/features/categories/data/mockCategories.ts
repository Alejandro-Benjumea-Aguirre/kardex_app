import type { Category } from '../../../types/domain';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Alimentos',   slug: 'alimentos',   color: '#f59e0b', is_active: true,  created_at: '2025-01-01' },
  { id: 2, name: 'Bebidas',     slug: 'bebidas',     color: '#3b82f6', is_active: true,  created_at: '2025-01-01' },
  { id: 3, name: 'Limpieza',    slug: 'limpieza',    color: '#10b981', is_active: true,  created_at: '2025-01-01' },
  { id: 4, name: 'Electrónica', slug: 'electronica', color: '#8b5cf6', is_active: true,  created_at: '2025-01-01' },
  { id: 5, name: 'Ropa',        slug: 'ropa',        color: '#ec4899', is_active: true,  created_at: '2025-01-01' },
  { id: 6, name: 'Otros',       slug: 'otros',       color: '#64748b', is_active: true,  created_at: '2025-01-01' },
];

export const CATEGORY_COLORS = [
  { label: 'Ámbar',    value: '#f59e0b' },
  { label: 'Azul',     value: '#3b82f6' },
  { label: 'Verde',    value: '#10b981' },
  { label: 'Violeta',  value: '#8b5cf6' },
  { label: 'Rosa',     value: '#ec4899' },
  { label: 'Rojo',     value: '#ef4444' },
  { label: 'Naranja',  value: '#f97316' },
  { label: 'Cian',     value: '#06b6d4' },
  { label: 'Pizarra',  value: '#64748b' },
  { label: 'Lima',     value: '#84cc16' },
];
