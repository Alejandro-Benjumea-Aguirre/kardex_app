import { useState, useCallback } from 'react';
import type { Category } from '../../../types/domain';
import { INITIAL_CATEGORIES } from '../data/mockCategories';

const STORAGE_KEY = 'kardex_categories';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function load(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Category[];
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
}

function save(categories: Category[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function useCategoryStore() {
  const [categories, setCategories] = useState<Category[]>(load);

  const add = useCallback((data: { name: string; description?: string; color: string; parent_id?: number }) => {
    setCategories(prev => {
      const next: Category[] = [
        ...prev,
        {
          id:          Math.max(0, ...prev.map(c => c.id)) + 1,
          name:        data.name.trim(),
          slug:        slugify(data.name),
          description: data.description?.trim() || undefined,
          color:       data.color,
          is_active:   true,
          created_at:  new Date().toISOString().slice(0, 10),
          parent_id:   data.parent_id,
        },
      ];
      save(next);
      return next;
    });
  }, []);

  const update = useCallback((id: number, data: { name: string; description?: string; color: string; is_active: boolean; parent_id?: number }) => {
    setCategories(prev => {
      const next = prev.map(c =>
        c.id === id
          ? { ...c, ...data, name: data.name.trim(), slug: slugify(data.name), description: data.description?.trim() || undefined, parent_id: data.parent_id }
          : c
      );
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      save(next);
      return next;
    });
  }, []);

  const toggleActive = useCallback((id: number) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c);
      save(next);
      return next;
    });
  }, []);

  return { categories, add, update, remove, toggleActive };
}
