import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Search, LogIn, UserPlus, LayoutDashboard, FileText, User, Shield, Users, LogOut, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout, isAdmin, isGraduate } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          {/* Logo + Name */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] text-white flex items-center justify-center font-bold text-base shadow-lg shadow-blue-200/50 group-hover:shadow-xl group-hover:shadow-blue-300/50 transition-all duration-300">
              R
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold text-[#0F172A] leading-tight">
                ระบบสืบค้นผลงานวิจัย
              </h1>
              <p className="text-[11px] text-gray-400 -mt-0.5">
                Research Project Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              ค้นหา
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Link>

                <Link to="/register"
                  className="flex items-center gap-2 ml-1 px-5 py-2.5 t rounded-xl bg-gradient-to-r from-[#2563EB] to-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 hover:scale-[1.02] transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  สมัครสมาชิก
                </Link>
              </>
            )}

            {isGraduate && (
              <>
                <Link
                  to="/graduate"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  แดชบอร์ด
                </Link>

                <Link
                  to="/graduate/works"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  ผลงานของฉัน
                </Link>

                <Link
                  to="/graduate/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  โปรไฟล์
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  ผู้ดูแล
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  ผู้ใช้
                </Link>

                <Link
                  to="/admin/works"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  ผลงานทั้งหมด
                </Link>
              </>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 ml-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white/95 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all"
              >
                <Search className="w-4 h-4" />
                ค้นหา
              </Link>

              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    เข้าสู่ระบบ
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100 transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-white " />
                    สมัครสมาชิก
                  </Link>
                </>
              )}

              {isGraduate && (
                <>
                  <Link to="/graduate" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    แดชบอร์ด
                  </Link>
                  <Link to="/graduate/works" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all">
                    <FileText className="w-4 h-4" />
                    ผลงานของฉัน
                  </Link>
                  <Link to="/graduate/profile" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-[#2563EB] transition-all">
                    <User className="w-4 h-4" />
                    โปรไฟล์
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
                    <Shield className="w-4 h-4" />
                    ผู้ดูแล
                  </Link>
                  <Link to="/admin/users" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
                    <Users className="w-4 h-4" />
                    ผู้ใช้
                  </Link>
                  <Link to="/admin/works" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
                    <FileText className="w-4 h-4" />
                    ผลงานทั้งหมด
                  </Link>
                </>
              )}

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all mt-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ ({user.fullName})
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}