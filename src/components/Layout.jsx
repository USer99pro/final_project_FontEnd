import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Search, LogIn, UserPlus, LayoutDashboard, FileText, User, Shield, Users, LogOut, Menu, X, GraduationCap, Activity, Tag } from 'lucide-react';
import PublicFooter from './public/PublicFooter';

export default function Layout({ children }) {
  const { user, logout, isAdmin, isGraduate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminArea = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'bg-surface-accent' : 'bg-surface-accent'}`}>
      {/* Skip navigation for Accessibility */}
      <a href="#main-content" className="skip-link">
        ข้ามไปที่เนื้อหาหลัก
      </a>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-main border-b border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className={`${isHomePage ? 'max-w-container-max' : 'max-w-7xl'} mx-auto px-gutter-mobile md:px-gutter-desktop h-16 flex items-center justify-between`}>

          {/* Logo + Name (Fixed H1 duplicate bug by using span/div) */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base bg-primary-container text-on-primary shadow-elevation-1 transition-all duration-300">
              R
            </div>
            <div className="hidden sm:block">
              <span className="text-headline-md font-semibold leading-tight text-on-background block">
                การพัฒนาระบบสืบค้นผลงานวิจัยของนักศึกษาระดับปริญญาตรี
              </span>
              <p className="text-label-sm text-text-secondary -mt-0.5">
                Research Project Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium transition-all duration-200 ${
                isHomePage
                  ? 'text-primary border-b-2 border-primary-container pb-1'
                  : 'text-on-surface-variant hover:bg-insight-tint hover:text-primary-container'
              }`}
            >
              <Search className="w-4 h-4" />
              ค้นหา
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-background transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-label-sm font-medium bg-primary-container text-on-primary hover:opacity-90 cursor-pointer transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>สมัครสมาชิก</span>
                </Link>
              </>
            )}

            {isGraduate && (
              <>
                <Link
                  to="/graduate"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  แดชบอร์ด
                </Link>

                <Link
                  to="/graduate/works"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  ผลงานของฉัน
                </Link>

                <Link
                  to="/graduate/profile"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
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
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  ผู้ดูแล
                </Link>

                <Link
                  to="/admin/users"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  ผู้ใช้
                </Link>

                <Link
                  to="/admin/works"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  ผลงานทั้งหมด
                </Link>

                <Link
                  to="/admin/advisors"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <GraduationCap className="w-4 h-4" />
                  ครูที่ปรึกษา
                </Link>

                <Link
                  to="/admin/categories"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <Tag className="w-4 h-4" />
                  หมวดหมู่/แท็ก
                </Link>

                <Link
                  to="/admin/audit"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all duration-200"
                >
                  <Activity className="w-4 h-4" />
                  Audit Logs
                </Link>
              </>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 ml-2 px-4 py-2 rounded-lg text-label-sm font-medium bg-error-container text-error hover:opacity-90 border border-error/20 transition-all duration-200 cursor-pointer"
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
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border-subtle bg-surface-main/95">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Mobile Navigation">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all"
              >
                <Search className="w-4 h-4" />
                ค้นหา
              </Link>

              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    เข้าสู่ระบบ
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary-container text-on-primary text-label-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>สมัครสมาชิก</span>
                  </Link>
                </>
              )}

              {isGraduate && (
                <>
                  <Link to="/graduate" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    แดชบอร์ด
                  </Link>
                  <Link to="/graduate/works" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <FileText className="w-4 h-4" />
                    ผลงานของฉัน
                  </Link>
                  <Link to="/graduate/profile" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <User className="w-4 h-4" />
                    โปรไฟล์
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <Shield className="w-4 h-4" />
                    ผู้ดูแล
                  </Link>
                  <Link to="/admin/users" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <Users className="w-4 h-4" />
                    ผู้ใช้
                  </Link>
                  <Link to="/admin/works" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <FileText className="w-4 h-4" />
                    ผลงานทั้งหมด
                  </Link>
                  <Link to="/admin/advisors" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <GraduationCap className="w-4 h-4" />
                    ครูที่ปรึกษา
                  </Link>
                  <Link to="/admin/categories" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <Tag className="w-4 h-4" />
                    หมวดหมู่/แท็ก
                  </Link>
                  <Link to="/admin/audit" onClick={closeMobile} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <Activity className="w-4 h-4" />
                    Audit Logs
                  </Link>
                </>
              )}

              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-sm font-medium text-error bg-error-container border border-error/20 hover:opacity-90 transition-all mt-1 cursor-pointer"
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
      <main id="main-content" className={`flex-1 w-full ${isHomePage ? 'pt-16' : 'pt-16 md:pt-20'}`}>
        {isHomePage ? (
          children
        ) : (
          <div
            className={`${isAdminArea ? 'max-w-none' : 'max-w-7xl mx-auto'} px-4 md:px-6 py-8`}
            style={isAdminArea ? { width: '100%', maxWidth: 'none' } : undefined}
          >
            {children}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
