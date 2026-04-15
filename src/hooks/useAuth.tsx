// src/hooks/useAuth.ts
// Hook + Context de autenticación — consume AuthService con JWT

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthService, AuthUser, LoginCredentials, ApiValidationError } from '../services/auth.service';

// ─── Tipos del contexto ───────────────────────────────────────────────────────

interface AuthState {
  user:          AuthUser | null;
  isAuthenticated: boolean;
  isLoading:     boolean;      // carga inicial (verificar si la sesión es válida)
  isSubmitting:  boolean;      // operaciones de login / logout
  error:         Record<string, string> | null;
}

interface AuthContextValue extends AuthState {
  login:  (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [state, setState] = useState<AuthState>({
    user:            AuthService.getUser(),   // carga optimista desde localStorage
    isAuthenticated: AuthService.isAuthenticated(),
    isLoading:       true,
    isSubmitting:    false,
    error:           null,
  });

  // ── Verificar sesión al montar ─────────────────────────────────────────────
  // Si hay token, llama a /auth/me para validarlo con el servidor.
  useEffect(() => {
    const verifySession = async () => {
      if (!AuthService.isAuthenticated()) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      try {
        const user = await AuthService.me();
        setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
      } catch {
        // Token inválido en el servidor — limpiar sesión
        AuthService.clearSession();
        setState(prev => ({ ...prev, user: null, isAuthenticated: false, isLoading: false }));
      }
    };

    verifySession();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const user = await AuthService.login(credentials);
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isSubmitting: false,
      }));
      navigate('/dashboard', { replace: true });

    } catch (err) {
      const axiosErr = err as AxiosError<ApiValidationError>;
      const errors   = AuthService.parseValidationErrors(axiosErr);
      setState(prev => ({ ...prev, isSubmitting: false, error: errors }));
      throw err; // re-lanzar para que el componente también pueda reaccionar
    }
  }, [navigate]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    await AuthService.logout();
    setState({
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      isSubmitting:    false,
      error:           null,
    });
    navigate('/login', { replace: true });
  }, [navigate]);

  // ── Limpiar errores ────────────────────────────────────────────────────────
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook consumidor ──────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}