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
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              R
            </div>

            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                ระบบสืบค้นผลงานวิจัย
              </h1>

              <p className="text-xs text-gray-500">
                Research Project Portal
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-3">

            <Link
              to="/"
              className="px-4 py-2 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              สืบค้น
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200 transition"
                >
                  เข้าสู่ระบบ
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full  from-blue-600 to-indigo-600  shadow-md hover:scale-105 transition text-xl text-white"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}

            {isGraduate && (
              <>
                <Link
                  to="/graduate"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  แดชบอร์ด
                </Link>

                <Link
                  to="/graduate/works"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  ผลงานของฉัน
                </Link>

                <Link
                  to="/graduate/profile"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  โปรไฟล์
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  ผู้ดูแล
                </Link>

                <Link
                  to="/admin/users"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  ผู้ใช้
                </Link>

                <Link
                  to="/admin/works"
                  className="px-4 py-2 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  ผลงานทั้งหมด
                </Link>
              </>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition"
              >
                ออกจากระบบ ({user.fullName})
              </button>
            )}

          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {children}
        </div>
      </main>

      

    </div>
  );
}