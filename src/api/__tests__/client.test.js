import { describe, it, expect, beforeEach, vi } from 'vitest';

const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
};

const storageMock = createLocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: storageMock, writable: true });
if (typeof globalThis !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', { value: storageMock, writable: true });
}

import api from '../client';

describe('API Client Security & Interceptor Audit', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('attaches Bearer token from localStorage to outgoing requests', async () => {
    localStorage.setItem('token', 'test-jwt-token-123');
    
    // Intercept request configuration in a mock handler
    let capturedAuthHeader = null;
    const originalAdapter = api.defaults.adapter;
    api.defaults.adapter = async (config) => {
      capturedAuthHeader = config.headers.Authorization;
      return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
    };

    await api.get('/api/test');
    expect(capturedAuthHeader).toBe('Bearer test-jwt-token-123');
    
    api.defaults.adapter = originalAdapter;
  });

  it('handles 429 Rate Limiting responses by extracting retryAfter and message', async () => {
    api.defaults.adapter = async (config) => {
      const error = new Error('Request failed with status code 429');
      error.config = config;
      error.response = {
        status: 429,
        data: { error: 'Too many requests — please try again later.', retryAfter: 300 },
        headers: {},
      };
      throw error;
    };

    try {
      await api.get('/api/auth/login');
      expect.unreachable('Should have thrown 429 error');
    } catch (err) {
      expect(err.response.status).toBe(429);
      expect(err.rateLimitInfo).toBeDefined();
      expect(err.rateLimitInfo.retryAfter).toBe(300);
      expect(err.rateLimitInfo.message).toContain('Too many requests');
    }
  });

  it('dispatches auth:unauthorized event and clears tokens on 401 revocation', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('refreshToken', 'revoked-refresh-token');

    let eventFired = false;
    window.addEventListener('auth:unauthorized', () => {
      eventFired = true;
    });

    api.defaults.adapter = async (config) => {
      if (config.url.includes('/api/auth/refresh')) {
        const error = new Error('Unauthorized');
        error.config = config;
        error.response = { status: 401, data: { error: 'Token Revoked' } };
        throw error;
      }
      const error = new Error('Unauthorized');
      error.config = config;
      error.response = { status: 401, data: { error: 'TOKEN_EXPIRED' } };
      throw error;
    };

    try {
      await api.get('/api/contents');
    } catch (err) {
      // Expected rejection
    }

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(eventFired).toBe(true);
  });
});
