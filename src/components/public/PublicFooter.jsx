import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, Info, ShieldCheck } from 'lucide-react';

/**
 * PublicFooter — Modern Academic Research Portal Footer
 * Compliant with udvc_research_portal_footer_spec.md
 */
export default function PublicFooter() {
  const currentYear = new Date().getFullYear() + 543;

  return (
    <footer className="bg-[#031B36] text-white w-full mt-auto border-t border-white/15 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] [&_a]:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Main Grid: Brand (6 cols), About (3 cols), Policy (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 md:pb-10 border-b border-white/15">
          
          {/* Brand Section (6 Columns) */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                การพัฒนาระบบสืบค้นผลงานวิจัย วิทยาลัยอาชีวศึกษาอุดรธานี
              </h2>
            </div>

            <p className="text-white text-sm leading-relaxed max-w-lg font-normal">
              คลังข้อมูลผลงานวิจัย นวัตกรรม และวิทยานิพนธ์ระดับปริญญาตรี เพื่อส่งเสริมการเรียนรู้และการต่อยอดทางวิชาการ
            </p>

            {/* Contact Information */}
            <address className="not-italic flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-6 gap-y-2.5 pt-2 text-sm text-white">
              <div className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:contact@udvc-research.online"
                  className="!text-white hover:!text-sky-300 font-medium transition-colors duration-200 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031B36] rounded"
                >
                  contact@udvc-research.online
                </a>
              </div>
              <div className="inline-flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
                <a
                  href="tel:021234567"
                  className="!text-white hover:!text-sky-300 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031B36] rounded"
                >
                  02-123-4567
                </a>
              </div>
            </address>
          </div>

          {/* About Section (3 Columns) */}
          <nav className="md:col-span-3 flex flex-col gap-4" aria-label="เกี่ยวกับเรา">
            <h3 className="font-semibold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" aria-hidden="true" />
              เกี่ยวกับเรา
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-sm !text-white hover:!text-sky-300 transition-colors duration-200 inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031B36] rounded"
                >
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm !text-white hover:!text-sky-300 transition-colors duration-200 inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031B36] rounded"
                >
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </nav>

          {/* Policy Section (3 Columns) */}
          <nav className="md:col-span-3 flex flex-col gap-4" aria-label="นโยบายและข้อตกลง">
            <h3 className="font-semibold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" aria-hidden="true" />
              นโยบายและข้อตกลง
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm !text-white hover:!text-sky-300 transition-colors duration-200 inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031B36] rounded"
                >
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm !text-white hover:!text-sky-300 transition-colors duration-200 inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031B36] rounded"
                >
                  ข้อตกลงการใช้งาน
                </Link>
              </li>
            </ul>
          </nav>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white">
          <p className="text-center sm:text-left text-white font-normal">
            © {currentYear} วิทยาลัยอาชีวศึกษาอุดรธานี. All rights reserved.
          </p>
          <span className="font-medium tracking-wide text-white text-center sm:text-right">
            UDVC Research Portal — Academic Horizon Edition
          </span>
        </div>
      </div>
    </footer>
  );
}
