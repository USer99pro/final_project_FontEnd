import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get('/api/auth/me');
      const userData = res.data.user || res.data;
      setUser(userData);
      return userData;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      throw err;
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setLoading(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
    } else {
      fetchMe().finally(() => setLoading(false));
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, []);

  const login = async (identifier, password) => {
    const cleanIdentifier = identifier ? String(identifier).trim() : '';
    const { data } = await api.post('/api/auth/login', {
      identifier: cleanIdentifier,
      email: cleanIdentifier,
      studentId: cleanIdentifier,
      username: cleanIdentifier,
      password,
    });
    if (data.accessToken || data.token) {
      localStorage.setItem('token', data.accessToken || data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    const userData = data.user || (await fetchMe());
    setUser(userData);
    return userData;
  };

  const register = async (payload) => {
    const { data } = await api.post('/api/auth/register', payload);
    if (data.accessToken || data.token) {
      localStorage.setItem('token', data.accessToken || data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    const userData = data.user || (await fetchMe());
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchMe,
        isAdmin: user?.role === 'admin',
        // Graduate features accessible only by graduate and user roles (not admin)
        isGraduate: Boolean(user) && (user.role === 'graduate' || user.role === 'user'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

