import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Attach stored token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bh-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bh-token');
      // Only redirect if on an admin page
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Menu API ──────────────────────────────────────────────────
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getOne: (id) => api.get(`/menu/${id}`),
  create: (formData) => api.post('/menu', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/menu/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/menu/${id}`),
};

// ── Order API ─────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status, note) => api.put(`/orders/${id}/status`, { status, note }),
  getAnalytics: () => api.get('/orders/analytics/summary'),
};
