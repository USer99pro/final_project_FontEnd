import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="loading">กำลังโหลด...</p>;
  if (!user) return <Navigate to="/login" replace />;

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  if (role === 'graduate' && user.role !== 'graduate' && user.role !== 'user' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
