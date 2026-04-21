import api, { TOKEN_KEY } from '../../../lib/axios';
import { AxiosError } from 'axios';
import type { User } from '../../../types/domain';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export type AuthUser = User;

interface BackendAuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

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

export const AuthService = {

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data } = await api.post<BackendAuthResponse>('/auth/login', {
      email:    credentials.email,
      password: credentials.password,
    });

    const authData = data.data;
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem('kardex_token_expires', String(Date.now() + authData.expires_in * 1000));
    localStorage.setItem('kardex_user', JSON.stringify(authData.user));

    return authData.user;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Token ya expirado — limpiar sesión local igualmente
    } finally {
      AuthService.clearSession();
    }
  },

  async refreshToken(): Promise<string> {
    const { data } = await api.post<BackendAuthResponse>('/auth/refresh');
    const authData = data.data;
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem('kardex_token_expires', String(Date.now() + authData.expires_in * 1000));
    return authData.access_token;
  },

  async me(): Promise<AuthUser> {
    const { data } = await api.get<BackendMeResponse>('/auth/me');
    localStorage.setItem('kardex_user', JSON.stringify(data.data));
    return data.data;
  },

  isAuthenticated(): boolean {
    const token   = localStorage.getItem(TOKEN_KEY);
    const expires = localStorage.getItem('kardex_token_expires');
    if (!token) return false;
    if (expires && Date.now() > Number(expires)) {
      AuthService.clearSession();
      return false;
    }
    return true;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem('kardex_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('kardex_token_expires');
    localStorage.removeItem('kardex_user');
  },

  parseValidationErrors(error: AxiosError<ApiValidationError>): Record<string, string> {
    const data = error.response?.data;
    if (data?.errors) {
      return Object.fromEntries(
        Object.entries(data.errors).map(([key, msgs]) => [key, msgs[0]])
      );
    }
    if (data?.error) {
      return { general: data.error.message };
    }
    return { general: data?.message ?? 'Error desconocido' };
  },
};
