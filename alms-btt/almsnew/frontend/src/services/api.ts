import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCoursePerformance: async (period: string = 'monthly') => {
    try {
      const response = await api.get(`/analytics/course-performance?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getContentUsage: async () => {
    try {
      const response = await api.get('/analytics/content-usage');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUserActivity: async (period: string = 'weekly') => {
    try {
      const response = await api.get(`/analytics/user-activity?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateSettings: async (settings: any) => {
    try {
      const response = await api.put('/users/settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  exportData: async () => {
    try {
      const response = await api.get('/users/export-data', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 