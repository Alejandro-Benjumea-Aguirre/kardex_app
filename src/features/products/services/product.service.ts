import api from '../../../lib/axios';
import type { Product } from '../../../types/domain';

export interface ProductPayload {
  name: string;
  slug: string;
  category_id?: string;
  sku?: string;
  description?: string;
  cost_price: number;
  sale_price: number;
  min_price?: number;
  price_includes_tax: boolean;
  tax_rate: number;
  type: 'physical' | 'service' | 'digital' | 'composite' | 'other';
  has_variants: boolean;
  attributes?: Record<string, string>;
  stock?: number;
  min_stock?: number;
  unit?: string;
  is_active?: boolean;
  track_inventory?: boolean;
}

// Shape the API actually returns — different from our flat Product type
interface ApiProductRaw {
  id: string;
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  type?: string;
  is_active?: boolean;
  has_variants?: boolean;
  category?: { id: string; name: string; slug?: string } | null;
  company?: { id: string; name: string };
  prices?: {
    cost?: string | number;
    sale?: string | number;
    min?: string | number;
    includes_tax?: boolean;
    tax_rate?: string | number;
    sale_with_tax?: number;
    margin?: number;
  };
  attributes?: unknown[] | Record<string, string>;
  stock?: number;
  min_stock?: number;
  unit?: string;
  track_inventory?: boolean;
  timestamps?: { created_at?: string; updated_at?: string };
  created_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { current_page: number; per_page: number; total: number; last_page: number };
}

function toNum(val: string | number | undefined | null): number {
  if (val === null || val === undefined) return 0;
  const n = typeof val === 'string' ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}

function normalizeProduct(raw: ApiProductRaw): Product {
  const attrs =
    raw.attributes && !Array.isArray(raw.attributes) && typeof raw.attributes === 'object'
      ? (raw.attributes as Record<string, string>)
      : undefined;

  return {
    id:                String(raw.id),
    name:              raw.name ?? '',
    slug:              raw.slug,
    sku:               raw.sku,
    description:       raw.description,
    type:              raw.type as Product['type'],
    // category comes as object from the API; we flatten it
    category:          raw.category?.name ?? undefined,
    category_id:       raw.category?.id  ?? undefined,
    cost_price:        toNum(raw.prices?.cost),
    sale_price:        toNum(raw.prices?.sale),
    min_price:         raw.prices?.min != null ? toNum(raw.prices.min) : undefined,
    price_includes_tax: raw.prices?.includes_tax ?? false,
    tax_rate:          raw.prices?.tax_rate != null ? toNum(raw.prices.tax_rate) : undefined,
    has_variants:      raw.has_variants ?? false,
    attributes:        attrs,
    stock:             raw.stock,
    min_stock:         raw.min_stock,
    unit:              raw.unit,
    is_active:         raw.is_active ?? true,
    track_inventory:   raw.track_inventory,
    created_at:        raw.timestamps?.created_at ?? raw.created_at,
  };
}

function extractArray(responseData: unknown): ApiProductRaw[] {
  if (Array.isArray(responseData)) return responseData as ApiProductRaw[];
  if (responseData && typeof responseData === 'object') {
    const inner = (responseData as { data?: unknown }).data;
    if (Array.isArray(inner)) return inner as ApiProductRaw[];
  }
  return [];
}

export const ProductService = {

  async getAll(): Promise<Product[]> {
    const { data } = await api.get<ApiResponse<ApiProductRaw[]>>('/products');
    return extractArray(data.data)
      .filter((p): p is ApiProductRaw => !!p && typeof p === 'object' && !!p.id)
      .map(normalizeProduct);
  },

  async create(payload: ProductPayload): Promise<Product> {
    const { data } = await api.post<ApiResponse<ApiProductRaw>>('/products', payload);
    return normalizeProduct(data.data);
  },

  async update(id: number | string, payload: ProductPayload): Promise<Product> {
    const { data } = await api.put<ApiResponse<ApiProductRaw>>(`/products/${id}`, payload);
    return normalizeProduct(data.data);
  },

  async toggleActive(id: number | string, action: 'activate' | 'deactivate'): Promise<Product | null> {
    const { data } = await api.patch<ApiResponse<ApiProductRaw>>(`/products/${id}/activate`, { action });
    return data?.data ? normalizeProduct(data.data) : null;
  },

};
