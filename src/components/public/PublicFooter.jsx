/**
 * PublicFooter Component
 * - White background with top border
 * - Copyright text
 * - วิทยาลัยอาชีวศึกษาอุดรธานี
 */
import { GraduationCap, Heart } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear() + 543; // Convert to Buddhist Era

  return (
    <footer className="bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Logo and name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#0F172A] text-sm">
                ระบบสืบค้นผลงานวิจัย
              </p>
              <p className="text-xs text-gray-400">
                Research Project Portal
              </p>
            </div>
          </div>

          {/* Center - Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-500 flex items-center gap-1">© {currentYear} วิทยาลัยอาชีวศึกษาอุดรธานี</p>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Udon Thani Vocational College
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
