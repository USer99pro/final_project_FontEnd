import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://final-project-backend-knyz.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiBase() {
  return API_URL;
}

export default api;
