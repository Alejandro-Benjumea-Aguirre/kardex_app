import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../../types/domain';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { ProductService } from '../services/product.service';
import type { ProductPayload } from '../services/product.service';

const STORAGE_KEY = 'kardex_products_v2';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function loadFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown[];
      const valid = parsed.filter((p): p is Product =>
        p !== null && typeof p === 'object' && 'name' in p &&
        typeof (p as Product).name === 'string' && !!(p as Product).name
      );
      if (valid.length > 0) return valid;
    }
  } catch { /* ignore */ }
  return INITIAL_PRODUCTS;
}

function saveToStorage(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export type ProductInput = Omit<ProductPayload, 'slug'>;
export type ProductType = 'dish' | 'beverage' | 'dessert' | 'other';

export function useProductStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    ProductService.getAll()
      .then(data => {
        if (!cancelled) {
          const valid = (data ?? []).filter(
            (p): p is Product =>
              p !== null &&
              p !== undefined &&
              typeof p === 'object' &&
              typeof (p as Product).name === 'string' &&
              !!(p as Product).name
          );
          setProducts(valid);
          saveToStorage(valid);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error('[ProductStore] Error al cargar productos:', err);
          const local = loadFromStorage();
          setProducts(local);
          setError('Sin conexión al servidor. Mostrando datos locales.');
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const add = useCallback(async (data: ProductInput) => {
    const payload: ProductPayload = { ...data, slug: slugify(data.name) };
    const created = await ProductService.create(payload);
    setProducts(prev => {
      const next = [...prev, created];
      saveToStorage(next);
      return next;
    });
  }, []);

  const update = useCallback(async (id: string, data: ProductInput) => {
    const payload: ProductPayload = { ...data, slug: slugify(data.name) };
    const updated = await ProductService.update(id, payload);
    setProducts(prev => {
      const next = prev.map(p =>
        p.id === id
          ? (updated ?? { ...p, ...data })
          : p
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate';
    const updated = await ProductService.toggleActive(id, action);
    setProducts(prev => {
      const next = prev.map(p =>
        p.id === id
          ? (updated ?? { ...p, is_active: !isActive })
          : p
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const activeProducts = products.filter(p => p.is_active);

  return { products, activeProducts, isLoading, error, add, update, toggleActive };
}
