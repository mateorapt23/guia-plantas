import axios from 'axios';

// URL base del backend
const API_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir a login si:
    // 1. El error es 401 (no autorizado)
    // 2. NO estamos en las rutas de auth (login/register)
    // 3. El usuario tiene un token guardado (significa que la sesión expiró)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthRoute = currentPath === '/login' || currentPath === '/register';
      const hasToken = localStorage.getItem('token');
      
      // Solo redirigir si NO estamos en login/register Y tenemos un token (sesión expirada)
      if (!isAuthRoute && hasToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// ========== SURVEY ==========
export const surveyAPI = {
  complete: (data) => api.post('/survey/complete', data),
  getMySurvey: () => api.get('/survey/my-survey'),
  getStatus: () => api.get('/survey/status'),
};

// ========== PLANTS ==========
export const plantsAPI = {
  getAll: (params) => api.get('/plants', { params }),
  getById: (id) => api.get(`/plants/${id}`),
};

// ========== RECOMMENDATIONS ==========
export const recommendationsAPI = {
  generate: () => api.post('/recommendations/generate'),
  getMyRecommendations: () => api.get('/recommendations/my-recommendations'),
  regenerate: () => api.post('/recommendations/regenerate'),
};

// ========== FAVORITES ==========
export const favoritesAPI = {
  add: (data) => api.post('/favorites', data),
  getAll: (params) => api.get('/favorites', { params }),
  check: (plantId) => api.get(`/favorites/check/${plantId}`),
  updateNotes: (plantId, notes) => api.put(`/favorites/${plantId}/notes`, { notes }),
  remove: (plantId) => api.delete(`/favorites/${plantId}`),
  getStats: () => api.get('/favorites/stats'),
};

// ========== ADMIN ==========
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Usuarios
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  changeUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  toggleUserStatus: (userId, isActive) => api.put(`/admin/users/${userId}/status`, { isActive }),
  
  // Plantas
  getPlants: (params) => api.get('/admin/plants', { params }),
  createPlant: (data) => api.post('/admin/plants', data),
  updatePlant: (plantId, data) => api.put(`/admin/plants/${plantId}`, data),
  deletePlant: (plantId) => api.delete(`/admin/plants/${plantId}`),
  permanentDeletePlant: (plantId) => api.delete(`/admin/plants/${plantId}/permanent`),
  reactivatePlant: (plantId) => api.put(`/admin/plants/${plantId}/reactivate`),
};

export default api;