import SEOHead from '../components/SEOHead';
import { BookOpen, ShieldCheck, Target, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <SEOHead
        title="เกี่ยวกับเรา | คลังข้อมูลงานวิจัยมหาวิทยาลัย"
        description="เรียนรู้เกี่ยวกับวัตถุประสงค์ พันธกิจ และโครงสร้างของคลังข้อมูลงานวิจัยมหาวิทยาลัย แหล่งรวมนวัตกรรมและวิทยานิพนธ์"
        canonicalUrl="https://udvc-research.online/about"
      />

      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl font-bold text-on-background">เกี่ยวกับคลังข้อมูลงานวิจัยมหาวิทยาลัย</h1>
        <p className="text-text-secondary text-lg leading-relaxed">
          คลังข้อมูลงานวิจัยมหาวิทยาลัย (UDVC Research Portal) เป็นระบบรวบรวม สืบเสาะ และเผยแพร่ผลงานวิชาการ งานวิจัย นวัตกรรม และวิทยานิพนธ์ในระดับอุดมศึกษา
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-main p-6 rounded-2xl border border-border-subtle space-y-3">
          <Target className="w-8 h-8 text-primary-container" />
          <h2 className="text-xl font-bold text-on-background">วิสัยทัศน์และวัตถุประสงค์</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            มุ่งมั่นสร้างศูนย์กลางข้อมูลทางวิชาการที่เปิดกว้าง น่าเชื่อถือ และเข้าถึงง่าย เพื่อสนับสนุนการเรียนรู้ การวิจัยต่อยอด และการประยุกต์ใช้นวัตกรรมในเชิงสังคมและอุตสาหกรรม
          </p>
        </div>

        <div className="bg-surface-main p-6 rounded-2xl border border-border-subtle space-y-3">
          <BookOpen className="w-8 h-8 text-primary-container" />
          <h2 className="text-xl font-bold text-on-background">ขอบเขตงานวิชาการ</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            ครอบคลุมผลงานวิทยานิพนธ์ ปริญญานิพนธ์ โครงงานวิจัย และบทความวิชาการ ในสาขาวิทยาการคอมพิวเตอร์ เทคโนโลยีสารสนเทศ บริหารธุรกิจ มัลติมีเดีย และวิศวกรรมศาสตร์
          </p>
        </div>

        <div className="bg-surface-main p-6 rounded-2xl border border-border-subtle space-y-3">
          <ShieldCheck className="w-8 h-8 text-primary-container" />
          <h2 className="text-xl font-bold text-on-background">การประกันคุณภาพข้อมูล</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            ทุกผลงานวิจัยที่ได้รับการเผยแพร่ในระบบ ผ่านการกลั่นกรองและตรวจสอบความถูกต้องจากคณะกรรมการอาจารย์ที่ปรึกษาและคณะผู้ดูแลระบบ
          </p>
        </div>

        <div className="bg-surface-main p-6 rounded-2xl border border-border-subtle space-y-3">
          <Users className="w-8 h-8 text-primary-container" />
          <h2 className="text-xl font-bold text-on-background">กลุ่มผู้ใช้งาน</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            รองรับนักศึกษา อาจารย์ นักวิจัย ภาคเอกชน และประชาชนทั่วไป ที่ต้องการสืบค้นอ้างอิงข้อมูล หรือค้นหาความร่วมมือทางวิชาการ
          </p>
        </div>
      </div>
    </div>
  );
}
