export interface Company {
  id: number;
  name: string;
  slug?: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  company?: Company;
  roles?: Role[];
  status?: { is_active: boolean; is_email_verified: boolean };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  parent_id?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  category_id?: string;
  sku?: string;
  description?: string;
  cost_price: number;
  sale_price: number;
  min_price?: number;
  price_includes_tax?: boolean;
  tax_rate?: number;
  type?: 'physical' | 'service' | 'digital' | 'composite' | 'other';
  has_variants?: boolean;
  attributes?: Record<string, string>;
  stock?: number;
  min_stock?: number;
  unit?: string;
  is_active: boolean;
  track_inventory?: boolean;
  image?: string;
  created_at?: string;
}

export interface SaleLine {
  id: string;
  name: string;
  stock: number;
  quantity: number;
  unit_price: number;
}

export interface Sale {
  id: number;
  date: string;
  due_date?: string;
  customer: string;
  sale_type: 'cash' | 'credit';
  payment_method: 'cash' | 'transfer' | 'card' | 'credit';
  lines: SaleLine[];
}

export interface PurchaseLine {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Purchase {
  id: number;
  date: string;
  supplier: string;
  purchase_type: 'inventory' | 'expense';
  payment_method: 'cash' | 'transfer' | 'credit';
  lines: PurchaseLine[];
}
