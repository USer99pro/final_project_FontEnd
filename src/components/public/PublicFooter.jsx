import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, ShieldCheck, FileText } from 'lucide-react';

/**
 * PublicFooter — Academic Intelligence design following DESIGN Footer.md guidelines (Pure White List Items)
 */
export default function PublicFooter() {
  const currentYear = new Date().getFullYear() + 543;

  return (
    <footer className="bg-gradient-to-b from-[#002045] to-[#011630] text-white w-full mt-auto border-t border-white/15 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] text-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Main Grid: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-6 border-b border-white/15 items-start">
          
          {/* Col 1: Institutional Branding & Contact Info (6 Cols) */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 font-bold text-sm text-white">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight">
                การพัฒนาระบบสืบค้นผลงานวิจัย วิทยาลัยอาชีวศึกษาอุดรธานี
              </span>
            </div>

            <p className="text-white text-xs leading-relaxed max-w-lg font-normal">
              คลังข้อมูลผลงานวิจัย นวัตกรรม และวิทยานิพนธ์ระดับปริญญาตรี เพื่อส่งเสริมการเรียนรู้และการต่อยอดทางวิชาการ
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-white">
              <span className="inline-flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-sky-400" />
                <a href="mailto:contact@udvc-research.online" className="text-white hover:text-sky-300 transition-colors font-medium">
                  contact@udvc-research.online
                </a>
              </span>
              <span className="inline-flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-sky-400" />
                <a href="tel:021234567" className="text-white hover:text-sky-300 transition-colors font-medium">
                  02-123-4567
                </a>
              </span>
            </div>
          </div>

          {/* Col 2: About Navigation (3 Cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              เกี่ยวกับสถาบัน
            </span>
            <div className="flex flex-col gap-2 pl-6">
              <Link to="/about" className="text-white hover:text-sky-300 hover:underline transition-colors font-medium">
                เกี่ยวกับเรา
              </Link>
              <Link to="/contact" className="text-white hover:text-sky-300 hover:underline transition-colors font-medium">
                ติดต่อเรา
              </Link>
            </div>
          </div>

          {/* Col 3: Legal & Policy (3 Cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              นโยบายและข้อตกลง
            </span>
            <div className="flex flex-col gap-2 pl-6">
              <Link to="/privacy" className="text-white hover:text-sky-300 hover:underline transition-colors font-medium">
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link to="/terms" className="text-white hover:text-sky-300 hover:underline transition-colors font-medium">
                ข้อตกลงการใช้งาน
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & System Identification */}
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-white">
          <p className="text-white">© {currentYear} วิทยาลัยอาชีวศึกษาอุดรธานี. All rights reserved.</p>
          <span className="font-semibold text-white tracking-wide">UDVC Research Portal — Academic Horizon Edition</span>
        </div>
      </div>
    </footer>
  );
}
