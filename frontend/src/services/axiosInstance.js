// axiosInstance.js
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.API_URL
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL, // proxy = "http://localhost:3000"
  timeout: 60000, // Tăng timeout lên 60 giây cho PDF/CSV
});

// Gắn token tự động
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const tempToken = sessionStorage.getItem('tempToken');
  if (tempToken) {
    config.headers.Authorization = `Bearer ${tempToken}`;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
  return config;
});

// Xử lý response chung
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
