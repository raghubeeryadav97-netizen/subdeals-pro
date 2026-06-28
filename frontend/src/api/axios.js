import axios from 'axios';
import { isDemoSession } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    const contentType = res.headers?.['content-type'] || '';
    if (contentType.includes('text/html') && res.config?.baseURL?.includes('/api')) {
      return Promise.reject({
        code: 'ERR_INVALID_API',
        invalidResponse: true,
        message: 'API returned HTML instead of JSON',
      });
    }
    return res;
  },
  async (error) => {
    if (error.response?.status === 401 && !isDemoSession()) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;