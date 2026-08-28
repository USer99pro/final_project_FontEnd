import SEOHead from '../components/SEOHead';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <SEOHead
        title="นโยบายความเป็นส่วนตัว | คลังข้อมูลงานวิจัยมหาวิทยาลัย"
        description="นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) สำหรับผู้ใช้งานระบบคลังข้อมูลงานวิจัยมหาวิทยาลัย"
        canonicalUrl="https://udvc-research.online/privacy"
      />

      <h1 className="text-3xl font-bold text-on-background">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
      <p className="text-sm text-text-secondary">ปรับปรุงล่าสุด: 29 สิงหาคม 2026</p>

      <div className="bg-surface-main p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">1. การเก็บรวบรวมข้อมูลส่วนบุคคล</h2>
          <p>
            คลังข้อมูลงานวิจัยมหาวิทยาลัย เก็บรวบรวมข้อมูลเท่าที่จำเป็นสำหรับการให้บริการสืบค้น และการลงทะเบียนยื่นส่งผลงานวิชาการ ได้แก่ ชื่อ-นามสกุล, อีเมลสถาบัน, สาขาวิชา, รหัสนักศึกษา และข้อมูลเกี่ยวกับผลงานวิจัย
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p>
            ข้อมูลที่เก็บรวบรวมจะถูกนำมาใช้เพื่อวัตถุประสงค์ในการระบุตัวตนของผู้สร้างสรรค์ผลงาน การแสดงเครดิตผู้จัดทำวิจัย การติดต่อประสานงาน และการพัฒนารักษาความปลอดภัยของระบบ
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">3. การเปิดเผยข้อมูลต่อบุคคลภายนอก</h2>
          <p>
            ทางระบบจะไม่ขาย โอน หรือเผยแพร่ข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก เว้นแต่ได้รับความยินยอมจากท่าน หรือเป็นกรณีที่ต้องปฏิบัติตามกฎหมาย
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">4. การรักษาความปลอดภัยของข้อมูล</h2>
          <p>
            เราใช้มาตรการรักษาความปลอดภัยทางเทคนิคและการบริหารจัดการที่เหมาะสม เพื่อปกป้องข้อมูลจากการเข้าถึงโดยไม่ได้รับอนุญาต การสูญหาย หรือการแก้ไขเปลี่ยนแปลงข้อมูล
          </p>
        </section>
      </div>
    </div>
  );
}
