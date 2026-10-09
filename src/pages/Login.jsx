import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackAnalyticsEvent } from '../api/analyticsService';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(identifier, password);
      trackAnalyticsEvent({
        event: 'LOGIN',
        page: '/login',
        userId: user?._id || user?.id || null,
      });
      if (user.role === 'admin') navigate('/admin');
      else navigate('/graduate');
    } catch (err) {
      setError(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="ds-page flex items-center justify-center px-4 py-10 bg-gradient-to-br from-surface-container-low via-surface-main to-surface-container">

      <div className="w-full max-w-md ds-panel shadow-elevation-hover overflow-hidden">
        <div className="ds-panel-header text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-elevation-1">
            R
          </div>
          <h1 className="font-display text-display-mobile mt-5">เข้าสู่ระบบ</h1>
          <p className="text-inverse-primary mt-2 text-body-md">
            สำหรับนักศึกษาที่จบการศึกษาและผู้ดูแลระบบ
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="ds-label">อีเมล หรือ รหัสนักศึกษา</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="กรอกอีเมล หรือ รหัสนักศึกษา"
                className="ds-input"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="ds-label">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="ds-input"
              />
            </div>

            {error && <div className="ds-alert-error">{error}</div>}

            <button type="submit" className="ds-btn-primary w-full py-3.5 text-body-emphasized">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
