// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface CompanyData {
  companyName: string;
  nit: string;
  sector: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface FormErrors {
  // Paso 1
  companyName?: string;
  nit?: string;
  sector?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  // Paso 2
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  // General
  general?: string;
}

// ─── SELECT OPTION TYPE ───────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}