import type { Category } from '../../../types/domain';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentos',   slug: 'alimentos',   is_active: true, created_at: '2025-01-01' },
  { id: '2', name: 'Bebidas',     slug: 'bebidas',     is_active: true, created_at: '2025-01-01' },
  { id: '3', name: 'Limpieza',    slug: 'limpieza',    is_active: true, created_at: '2025-01-01' },
  { id: '4', name: 'Electrónica', slug: 'electronica', is_active: true, created_at: '2025-01-01' },
  { id: '5', name: 'Ropa',        slug: 'ropa',        is_active: true, created_at: '2025-01-01' },
  { id: '6', name: 'Otros',       slug: 'otros',       is_active: true, created_at: '2025-01-01' },
];
