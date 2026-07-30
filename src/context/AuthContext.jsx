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
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
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

  const loginWithToken = async (token, refreshToken) => {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    const userData = await fetchMe();
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
        loginWithToken,
        logout,
        fetchMe,
        isAdmin: user?.role === 'admin',
        // Keep private navigation hidden until a user has been authenticated.
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

