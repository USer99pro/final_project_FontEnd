import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  Search,
  LogIn,
  LayoutDashboard,
  FileText,
  User,
  Shield,
  Users,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Activity,
  Tag,
  BarChart3,
} from 'lucide-react';
import PublicFooter from './public/PublicFooter';

export default function Layout({ children }) {
  const { user, logout, isAdmin, isGraduate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isAdminArea = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const adminNavItems = [
    {
      to: '/admin',
      label: 'แดชบอร์ด & ข้อมูลระบบ',
      shortLabel: 'แดชบอร์ด',
      icon: BarChart3,
      subItems: [
        { to: '/admin', label: '📊 ภาพรวม & สถิติวิจัย' },
        { to: '/admin/analytics', label: '🌐 สถิติผู้เข้าชมเว็บไซต์' },
        { to: '/admin/audit', label: '🛡️ บันทึก Audit Logs' },
      ],
    },
    { to: '/admin/users', label: 'จัดการผู้ใช้งาน', shortLabel: 'ผู้ใช้งาน', icon: Users },
    { to: '/admin/works', label: 'จัดการผลงานทั้งหมด', shortLabel: 'ผลงานทั้งหมด', icon: FileText },
    { to: '/admin/advisors', label: 'จัดการครูที่ปรึกษา', shortLabel: 'ครูที่ปรึกษา', icon: GraduationCap },
    { to: '/admin/categories', label: 'จัดการหมวดหมู่/แท็ก', shortLabel: 'หมวดหมู่/แท็ก', icon: Tag },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isHomePage ? 'bg-surface-accent' : 'bg-surface-accent'}`}>
      {/* Skip navigation for Accessibility */}
      <a href="#main-content" className="skip-link">
        ข้ามไปที่เนื้อหาหลัก
      </a>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-main border-b border-border-subtle shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className={`${isAdmin ? 'w-full px-2 sm:px-4 xl:px-6' : (isHomePage ? 'max-w-container-max px-4 sm:px-6' : 'max-w-7xl px-4 sm:px-6')} mx-auto h-16 flex items-center justify-between gap-2 xl:gap-3`}>

          {/* Logo + Concise Title */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 group no-underline"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-base bg-primary-container text-on-primary shadow-elevation-1 transition-transform duration-300 group-hover:scale-105 shrink-0">
              R
            </div>
            <div className="hidden sm:block">
              <span className="text-sm md:text-base font-bold text-on-background block whitespace-nowrap leading-tight">
                ระบบสืบค้นผลงานวิจัย
              </span>
              <p className={`text-[11px] text-text-secondary whitespace-nowrap ${isAdmin ? 'hidden 2xl:block' : ''}`}>
                ระดับปริญญาตรี • Research Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 whitespace-nowrap shrink-0 overflow-x-auto no-scrollbar" aria-label="Main Navigation">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${isHomePage
                  ? 'text-primary bg-insight-tint font-semibold'
                  : 'text-on-surface-variant hover:bg-insight-tint hover:text-primary-container'
                }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>ค้นหา</span>
            </Link>

            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium whitespace-nowrap bg-primary-container text-on-primary hover:opacity-90 cursor-pointer transition-all duration-200 shadow-sm"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}

            {isGraduate && (
              <Link
                to="/graduate"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  location.pathname === '/graduate' || location.pathname.startsWith('/graduate/works')
                    ? 'text-primary bg-insight-tint font-semibold'
                    : 'text-on-surface-variant hover:bg-insight-tint hover:text-primary-container'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>แดชบอร์ดผลงานวิจัย</span>
              </Link>
            )}

            {/* Admin Navigation — แสดงเต็ม Navbar ไม่ตกบรรทัด */}
            {isAdmin && (
              <div className="flex items-center gap-0.5 xl:gap-1 shrink-0">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.to === '/admin'
                      ? location.pathname === '/admin' ||
                        location.pathname.startsWith('/admin/analytics') ||
                        location.pathname.startsWith('/admin/audit')
                      : location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      title={item.label}
                      className={`flex items-center gap-1 xl:gap-1.5 px-2 py-1.5 xl:px-2.5 xl:py-2 rounded-lg text-xs 2xl:text-sm font-medium whitespace-nowrap no-underline shrink-0 transition-all duration-150 ${active
                          ? 'bg-insight-tint text-primary-container font-semibold border border-primary-container/20 shadow-xs'
                          : 'text-on-surface-variant hover:bg-insight-tint hover:text-primary-container'
                        }`}
                    >
                      <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${active ? 'text-primary-container' : 'text-text-secondary'}`} />
                      <span className="hidden 2xl:inline no-underline">{item.label}</span>
                      <span className="2xl:hidden no-underline">{item.shortLabel}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Profile Link */}
            {user && (
              <Link
                to="/graduate/profile"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-lg text-xs xl:text-sm font-medium whitespace-nowrap no-underline shrink-0 transition-all duration-150 ${location.pathname === '/graduate/profile'
                    ? 'text-primary bg-insight-tint font-semibold'
                    : 'text-on-surface-variant hover:bg-insight-tint hover:text-primary-container'
                  }`}
              >
                <User className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                <span>โปรไฟล์</span>
              </Link>
            )}

            {/* Logout Button */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 ml-1 px-3 py-1.5 xl:px-3.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium whitespace-nowrap no-underline bg-error-container text-error hover:bg-error hover:text-white border border-error/20 transition-all duration-150 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>ออกจากระบบ</span>
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
          <div className="lg:hidden border-t border-border-subtle bg-surface-main max-h-[calc(100vh-4rem)] overflow-y-auto shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Mobile Navigation">
              <Link
                to="/"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isHomePage ? 'bg-insight-tint text-primary font-semibold' : 'text-on-surface-variant hover:bg-insight-tint'
                  }`}
              >
                <Search className="w-4 h-4 text-primary-container shrink-0" />
                <span>ค้นหา</span>
              </Link>

              {!user && (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary-container text-on-primary text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <LogIn className="w-4 h-4 shrink-0" />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              )}

              {isGraduate && (
                <div className="mt-2 pt-2 border-t border-border-subtle">
                  <div className="px-3 py-1 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                    เมนูผู้ใช้งาน
                  </div>
                  <Link to="/graduate" onClick={closeMobile} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    <span>แดชบอร์ดผลงานวิจัย</span>
                  </Link>
                  <Link to="/graduate/profile" onClick={closeMobile} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all">
                    <User className="w-4 h-4 shrink-0" />
                    <span>โปรไฟล์</span>
                  </Link>
                </div>
              )}

              {isAdmin && (
                <div className="mt-2 pt-2 border-t border-border-subtle">
                  <div className="px-3 py-1 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                    เมนูผู้ดูแลระบบ (Admin)
                  </div>
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                      item.to === '/admin'
                        ? location.pathname === '/admin' ||
                          location.pathname.startsWith('/admin/analytics') ||
                          location.pathname.startsWith('/admin/audit')
                        : location.pathname === item.to;
                    return (
                      <div key={item.to} className="space-y-0.5">
                        <Link
                          to={item.to}
                          onClick={closeMobile}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            active ? 'bg-insight-tint text-primary-container font-semibold' : 'text-on-surface-variant hover:bg-insight-tint'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-primary-container" />
                          <span>{item.label}</span>
                        </Link>
                        {item.subItems && (
                          <div className="pl-9 pr-3 py-1 space-y-1">
                            {item.subItems.map((sub) => {
                              const subActive = location.pathname === sub.to;
                              return (
                                <Link
                                  key={sub.to}
                                  to={sub.to}
                                  onClick={closeMobile}
                                  className={`block px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    subActive ? 'text-primary-container font-bold bg-insight-tint' : 'text-text-secondary hover:text-on-background'
                                  }`}
                                >
                                  • {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <Link
                    to="/graduate/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-insight-tint hover:text-primary-container transition-all"
                  >
                    <User className="w-4 h-4 shrink-0" />
                    <span>โปรไฟล์ส่วนตัว</span>
                  </Link>
                </div>
              )}

              {user && (
                <div className="mt-3 pt-2 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-error bg-error-container border border-error/20 hover:bg-error hover:text-white transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>ออกจากระบบ {user.fullName ? `(${user.fullName})` : ''}</span>
                  </button>
                </div>
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
