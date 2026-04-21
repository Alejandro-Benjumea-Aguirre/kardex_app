import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL   = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const TOKEN_KEY = 'kardex_token';

const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('kardex_token_expires');
      localStorage.removeItem('kardex_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      console.warn('[Axios] Acceso denegado (403)');
    }

    if (status === 500) {
      console.error('[Axios] Error interno del servidor (500)');
    }

    return Promise.reject(error);
  }
);

export default api;
export { TOKEN_KEY };
