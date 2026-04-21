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

export interface Product {
  id: number;
  name: string;
  category: string;
  sku?: string;
  description?: string;
  purchase_price: number;
  sale_price: number;
  tax: number;
  stock: number;
  min_stock: number;
  unit: string;
  is_active: boolean;
  track_inventory: boolean;
  image?: string;
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
