import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import * as AuthModule from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute RBAC Security Component', () => {
  it('renders loading text when auth state is loading', () => {
    AuthModule.useAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MemoryRouter>
        <ProtectedRoute role="graduate">
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('กำลังโหลด...')).toBeDefined();
  });

  it('redirects unauthenticated user to /login', () => {
    AuthModule.useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={['/graduate']}>
        <Routes>
          <Route
            path="/graduate"
            element={
              <ProtectedRoute role="graduate">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeDefined();
  });

  it('redirects graduate user away from admin routes', () => {
    AuthModule.useAuth.mockReturnValue({
      user: { role: 'graduate', email: 'student@udvc.ac.th' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeDefined();
  });

  it('allows admin user to access admin routes', () => {
    AuthModule.useAuth.mockReturnValue({
      user: { role: 'admin', email: 'admin@udvc.ac.th' },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeDefined();
  });
});
