import SEOHead from '../components/SEOHead';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <SEOHead
        title="ติดต่อเรา | คลังข้อมูลงานวิจัยมหาวิทยาลัย"
        description="ติดต่อสอบถามข้อมูลการใช้งาน การส่งผลงานวิจัย หรือแจ้งปัญหาเกี่ยวกับระบบคลังข้อมูลงานวิจัยมหาวิทยาลัย"
        canonicalUrl="https://udvc-research.online/contact"
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-on-background">ติดต่อเรา</h1>
        <p className="text-text-secondary leading-relaxed">
          หากท่านมีข้อสงสัย ข้อเสนอแนะ หรือต้องการสอบถามเกี่ยวกับการส่งและสืบค้นผลงานวิจัย สามารถติดต่อศูนย์บริหารจัดการข้อมูลวิจัยได้ตามช่องทางด้านล่าง
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-main p-6 rounded-2xl border border-border-subtle space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-primary-container shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-on-background text-base">ที่อยู่สถาบัน / สำนักงาน</h2>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                ศูนย์คลังข้อมูลงานวิจัย มหาวิทยาลัยเทคโนโลยีและอาชีวศึกษา<br />
                อาคารวิทยบริการ ชั้น 4 เลขที่ 123 ถนนวิทยการ แขวง/ตำบลในเมือง<br />
                ประเทศไทย 10100
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
            <Mail className="w-5 h-5 text-primary-container shrink-0" />
            <div>
              <span className="text-xs text-text-secondary block">อีเมลติดต่อสถาบัน</span>
              <a href="mailto:contact@udvc-research.online" className="text-sm font-semibold text-primary-container hover:underline">
                contact@udvc-research.online
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
            <Phone className="w-5 h-5 text-primary-container shrink-0" />
            <div>
              <span className="text-xs text-text-secondary block">โทรศัพท์สอบถาม</span>
              <span className="text-sm font-semibold text-on-background">02-123-4567 ต่อ 890</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
            <Clock className="w-5 h-5 text-primary-container shrink-0" />
            <div>
              <span className="text-xs text-text-secondary block">เวลาทำการ</span>
              <span className="text-sm font-medium text-on-background">จันทร์ - ศุกร์: 08.30 - 16.30 น. (เว้นวันหยุดนักขัตฤกษ์)</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-main p-6 rounded-2xl border border-border-subtle space-y-4">
          <h2 className="font-bold text-on-background text-lg">ส่งข้อความถึงเรา</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('ขอบคุณสำหรับการติดต่อ ทีมงานจะตอบกลับโดยเร็วที่สุด'); }} className="space-y-3">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-text-secondary mb-1">ชื่อ-นามสกุล</label>
              <input id="contact-name" type="text" required placeholder="กรอกชื่อ-นามสกุล" className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-accent text-sm outline-none focus:ring-2 focus:ring-primary-container" />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-text-secondary mb-1">อีเมลติดต่อ</label>
              <input id="contact-email" type="email" required placeholder="example@domain.com" className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-accent text-sm outline-none focus:ring-2 focus:ring-primary-container" />
            </div>

            <div>
              <label htmlFor="contact-msg" className="block text-xs font-semibold text-text-secondary mb-1">ข้อความ / เรื่องที่ติดต่อ</label>
              <textarea id="contact-msg" rows={4} required placeholder="พิมพ์ข้อความที่ต้องการสอบถาม..." className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-accent text-sm outline-none focus:ring-2 focus:ring-primary-container" />
            </div>

            <button type="submit" className="w-full py-2.5 bg-primary-container text-on-primary font-semibold text-sm rounded-xl hover:opacity-90 transition cursor-pointer">
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
