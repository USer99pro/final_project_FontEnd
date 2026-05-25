import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout, isAdmin, isGraduate } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">
          ระบบสืบค้นผลงานวิจัย
        </Link>
        <nav>
          <Link to="/">สืบค้น</Link>
          {!user && (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link to="/register">สมัครสมาชิก</Link>
            </>
          )}
          {isGraduate && (
            <>
              <Link to="/graduate">แดชบอร์ด</Link>
              <Link to="/graduate/works">ผลงานของฉัน</Link>
              <Link to="/graduate/profile">โปรไฟล์</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin">ผู้ดูแล</Link>
              <Link to="/admin/users">ผู้ใช้</Link>
              <Link to="/admin/works">ผลงานทั้งหมด</Link>
            </>
          )}
          {user && (
            <button type="button" className="btn-link" onClick={handleLogout}>
              ออกจากระบบ ({user.fullName})
            </button>
          )}
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">Research Portal — Final Project</footer>
    </div>
  );
}
