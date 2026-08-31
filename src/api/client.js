import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "localhost:3500";
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
  timeout: 60000, // 60 seconds timeout to accommodate Render.com cold starts
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Track request start time for response duration logging
  config.metadata = { startTime: typeof performance !== 'undefined' ? performance.now() : Date.now() };

  const method = (config.method || 'GET').toUpperCase();
  const fullUrl = `${config.baseURL || ''}${config.url || ''}`;

  console.groupCollapsed?.(`%c[API Request] %c${method} %c${fullUrl}`, 'color: #3b82f6; font-weight: bold;', 'color: #10b981; font-weight: bold;', 'color: gray;');
  console.log('Method:', method);
  console.log('URL:', fullUrl);
  if (config.params) console.log('Params:', config.params);
  if (config.data) console.log('Payload:', config.data);
  console.log('Headers:', config.headers);
  console.groupEnd?.();

  return config;
});

api.interceptors.response.use(
  (response) => {
    const startTime = response.config?.metadata?.startTime;
    const duration = startTime ? `${Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime)}ms` : 'N/A';
    const method = (response.config?.method || 'GET').toUpperCase();
    const fullUrl = `${response.config?.baseURL || ''}${response.config?.url || ''}`;

    console.groupCollapsed?.(
      `%c[API Response] %c${response.status} %c${method} %c${fullUrl} %c(${duration})`,
      'color: #10b981; font-weight: bold;',
      'color: #059669; font-weight: bold;',
      'color: #3b82f6; font-weight: bold;',
      'color: gray;',
      'color: #8b5cf6; font-weight: bold;'
    );
    console.log('Status:', response.status, response.statusText);
    console.log('Duration:', duration);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.groupEnd?.();

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const startTime = originalRequest?.metadata?.startTime;
    const duration = startTime ? `${Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime)}ms` : 'N/A';
    const method = (originalRequest?.method || 'UNKNOWN').toUpperCase();
    const fullUrl = `${originalRequest?.baseURL || ''}${originalRequest?.url || ''}`;
    const status = error.response?.status || 'NETWORK_ERROR';

    console.groupCollapsed?.(
      `%c[API Error] %c${status} %c${method} %c${fullUrl} %c(${duration})`,
      'color: #ef4444; font-weight: bold;',
      'color: #dc2626; font-weight: bold;',
      'color: #3b82f6; font-weight: bold;',
      'color: gray;',
      'color: #8b5cf6; font-weight: bold;'
    );
    console.error('Error Message:', error.message);
    console.log('Status:', status);
    console.log('Duration:', duration);
    if (error.response?.data) console.log('Response Error Body:', error.response.data);
    console.groupEnd?.();

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

