// src/config/axios.config.ts
// Instancia de Axios configurada con interceptores JWT para Laravel + tymon/jwt-auth

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ─── Constantes ───────────────────────────────────────────────────────────────
const API_URL   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const TOKEN_KEY = 'kardex_token';

// ─── Instancia base ───────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Interceptor REQUEST — adjunta el token JWT en cada petición ──────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Interceptor RESPONSE — maneja errores globales ───────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;

    // 401 — Token expirado o inválido: limpiar sesión y redirigir al login
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Evitar bucle si ya estamos en /login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // 403 — Sin permisos
    if (status === 403) {
      console.warn('[Axios] Acceso denegado (403)');
    }

    // 422 — Errores de validación Laravel: los devuelve tal cual para manejarlos en el componente
    // 500 — Error del servidor
    if (status === 500) {
      console.error('[Axios] Error interno del servidor (500)');
    }

    return Promise.reject(error);
  }
);

export default api;
export { TOKEN_KEY };