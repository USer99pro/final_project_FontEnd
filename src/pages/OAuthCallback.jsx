import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Backend redirects with accessToken/refreshToken. Keep `token` as a
    // fallback for older deployments.
    const token = searchParams.get('accessToken') || searchParams.get('token') || window.location.hash.match(/(?:accessToken|token)=([^&]*)/)?.[1];
    const refreshToken = searchParams.get('refreshToken') || window.location.hash.match(/refreshToken=([^&]*)/)?.[1];
    const err = searchParams.get('error');

    if (err) {
      setError(decodeURIComponent(err) || 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ');
      return;
    }

    if (!token) {
      setError('ไม่พบ Token ยืนยันตัวตนจาก Google OAuth');
      return;
    }

    loginWithToken(token, refreshToken)
      .then((user) => {
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/graduate');
        }
      })
      .catch((e) => {
        console.error('OAuth Login failed:', e);
        setError('ไม่สามารถยืนยันตัวตนด้วย Token ได้');
      });
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="max-w-md w-full bg-surface-main rounded-2xl shadow-lg border border-border-subtle p-8 text-center">
        {error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✕
            </div>
            <h2 className="text-xl font-bold text-on-background">เกิดข้อผิดพลาดในการเข้าสู่ระบบ</h2>
            <p className="text-sm text-error bg-error-container p-3 rounded-lg border border-error/30">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-primary-container hover:bg-primary text-white font-medium rounded-xl transition"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-bold text-on-background">กำลังยืนยันตัวตนด้วย Google OAuth...</h2>
            <p className="text-sm text-text-secondary">กรุณารอสักครู่ ระบบกำลังนำคุณเข้าสู่ระบบ</p>
          </div>
        )}
      </div>
    </div>
  );
}
