import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../../../types/domain';
import { INITIAL_CATEGORIES } from '../data/mockCategories';
import { CategoryService } from '../services/category.service';
import type { CategoryPayload } from '../services/category.service';

const STORAGE_KEY = 'kardex_categories';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function capitalizeName(text: string): string {
  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function loadFromStorage(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Category[];
  } catch { /* ignore */ }
  return INITIAL_CATEGORIES;
}

function saveToStorage(categories: Category[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function useCategoryStore() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    CategoryService.getAll()
      .then(data => {
        if (!cancelled) {
          setCategories(data);
          saveToStorage(data);
        }
      })
      .catch(() => {
        // Backend no disponible: usar datos locales como fallback
        if (!cancelled) {
          const local = loadFromStorage();
          setCategories(local);
          setError('Sin conexión al servidor. Mostrando datos locales.');
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const add = useCallback(async (data: { name: string; description?: string; parent_id?: string }) => {
    const name = capitalizeName(data.name);
    const payload: CategoryPayload = {
      name,
      slug:        slugify(data.name),
      description: data.description?.trim() || undefined,
      is_active:   true,
      parent_id:   data.parent_id,
    };
    const created = await CategoryService.create(payload);
    setCategories(prev => {
      const next = [...prev, created];
      saveToStorage(next);
      return next;
    });
  }, []);

  const update = useCallback(async (id: string, data: { name: string; description?: string; is_active: boolean; parent_id?: string }) => {
    const name = capitalizeName(data.name);
    const payload: CategoryPayload = {
      name,
      slug:        slugify(data.name),
      description: data.description?.trim() || undefined,
      is_active:   data.is_active,
      parent_id:   data.parent_id,
    };
    const updated = await CategoryService.update(id, payload);
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? updated : c);
      saveToStorage(next);
      return next;
    });
  }, []);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate';
    const updated = await CategoryService.toggleActive(id, action);
    setCategories(prev => {
      const next = prev.map(c =>
        c.id === id
          ? (updated ?? { ...c, is_active: !isActive })
          : c
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  return { categories, isLoading, error, add, update, toggleActive };
}
