import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3500";
let refreshRequest = null;

const notifyUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
};

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds request timeout for security against slowloris
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');

    // Handle 429 Rate Limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.data?.retryAfter || error.response.headers?.['retry-after'];
      const message = error.response.data?.error || 'คำขอมากเกินไป กรุณาลองใหม่อีกครั้ง';
      error.rateLimitInfo = {
        message,
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : null
      };
    }

    // Access tokens expire after 15 minutes. Refresh once, then retry the
    // original request with the replacement access token.
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      refreshToken &&
      !originalRequest?.url?.includes('/api/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        // Several protected views can load in parallel. Reuse one refresh
        // request so token rotation is never attempted more than once.
        if (!refreshRequest) {
          refreshRequest = api
            .post('/api/auth/refresh', { refreshToken })
            .then(({ data }) => {
              localStorage.setItem('token', data.accessToken);
              localStorage.setItem('refreshToken', data.refreshToken);
              return data.accessToken;
            })
            .finally(() => {
              refreshRequest = null;
            });
        }
        const accessToken = await refreshRequest;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        notifyUnauthorized();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      notifyUnauthorized();
    }
    return Promise.reject(error);
  }
);

export function getApiBase() {
  return API_URL;
}

export function getGoogleAuthUrl() {
  return `${API_URL}/api/auth/google`;
}

export async function uploadPaper(file) {
  const formData = new FormData();
  formData.append('pdf', file);
  const response = await api.post('/api/contents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function loadData(endpoint) {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

export default api;

