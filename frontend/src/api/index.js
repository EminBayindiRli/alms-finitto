import axios from 'axios';

// API base URL'lerini yapılandır
const baseURL = import.meta.env.VITE_API_URL || 'https://alms-backend.onrender.com';

// Axios instance oluştur
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios istek interceptor'u
api.interceptors.request.use(
  (config) => {
    console.log(`API Request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Axios yanıt interceptor'u
api.interceptors.response.use(
  (response) => {
    console.log('API Response received');
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;
