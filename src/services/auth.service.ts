// src/services/auth.service.ts
// Servicio de autenticación — JWT con tymon/jwt-auth en Laravel

import api, { TOKEN_KEY } from '../config/axios.config';
import { AxiosError } from 'axios';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  company?: {
    id: number;
    name: string;
    slug?: string;
  };
  roles?: Array<{ id: number; name: string; display_name: string }>;
  status?: { is_active: boolean; is_email_verified: boolean };
}

// Respuesta real del backend: { success: true, data: { user, access_token, token_type, expires_in } }
interface BackendAuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

// Respuesta real del /auth/me: { success: true, data: UserResource }
interface BackendMeResponse {
  success: boolean;
  data: AuthUser;
}

export interface ApiValidationError {
  success?: boolean;
  message: string;
  errors?: Record<string, string[]>;
  error?: { code: string; message: string };
}

// ─── AuthService ──────────────────────────────────────────────────────────────

export const AuthService = {

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  /**
   * POST /api/auth/login
   * Llama al controlador AuthController@login de Laravel.
   * Guarda el token JWT en localStorage y devuelve los datos del usuario.
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data } = await api.post<BackendAuthResponse>('/auth/login', {
      email:    credentials.email,
      password: credentials.password,
    });

    const authData = data.data;

    // Persistir token y metadatos de expiración
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem('kardex_token_expires', String(
      Date.now() + authData.expires_in * 1000
    ));
    localStorage.setItem('kardex_user', JSON.stringify(authData.user));

    return authData.user;
  },

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  /**
   * POST /api/auth/logout
   * Invalida el token en el servidor (tymon/jwt-auth blacklist) y limpia localStorage.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Si el token ya expiró igualmente limpiamos la sesión local
    } finally {
      AuthService.clearSession();
    }
  },

  // ── REFRESH TOKEN ─────────────────────────────────────────────────────────
  /**
   * POST /api/auth/refresh
   * Solicita un nuevo token antes de que expire el actual.
   * tymon/jwt-auth invalida el token anterior al emitir el nuevo.
   */
  async refreshToken(): Promise<string> {
    const { data } = await api.post<BackendAuthResponse>('/auth/refresh');

    const authData = data.data;
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem('kardex_token_expires', String(
      Date.now() + authData.expires_in * 1000
    ));

    return authData.access_token;
  },

  // ── OBTENER USUARIO AUTENTICADO ───────────────────────────────────────────
  /**
   * GET /api/auth/me
   * Consulta el perfil del usuario activo directamente al servidor.
   */
  async me(): Promise<AuthUser> {
    const { data } = await api.get<BackendMeResponse>('/auth/me');
    localStorage.setItem('kardex_user', JSON.stringify(data.data));
    return data.data;
  },

  // ── HELPERS LOCALES ───────────────────────────────────────────────────────

  /** Devuelve true si existe un token en localStorage */
  isAuthenticated(): boolean {
    const token   = localStorage.getItem(TOKEN_KEY);
    const expires = localStorage.getItem('kardex_token_expires');
    if (!token) return false;
    // Verificar que no haya expirado localmente (comprobación optimista)
    if (expires && Date.now() > Number(expires)) {
      AuthService.clearSession();
      return false;
    }
    return true;
  },

  /** Devuelve el token JWT almacenado */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Devuelve el usuario cacheado en localStorage (sin llamada al servidor) */
  getUser(): AuthUser | null {
    const raw = localStorage.getItem('kardex_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  /** Elimina toda la información de sesión del localStorage */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('kardex_token_expires');
    localStorage.removeItem('kardex_user');
  },

  /**
   * Extrae los errores de validación de una respuesta 422 de Laravel
   * y los devuelve como un objeto plano { campo: 'primer mensaje' }
   */
  parseValidationErrors(error: AxiosError<ApiValidationError>): Record<string, string> {
    const data = error.response?.data;
    // Errores de validación Laravel 422: { success: false, message, errors: { campo: ['msg'] } }
    if (data?.errors) {
      return Object.fromEntries(
        Object.entries(data.errors).map(([key, msgs]) => [key, msgs[0]])
      );
    }
    // Errores de negocio del backend: { success: false, error: { code, message } }
    if (data?.error) {
      return { general: data.error.message };
    }
    return { general: data?.message ?? 'Error desconocido' };
  },
};