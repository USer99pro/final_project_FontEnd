import SEOHead from '../components/SEOHead';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <SEOHead
        title="ข้อตกลงและเงื่อนไขการใช้งาน | คลังข้อมูลงานวิจัยมหาวิทยาลัย"
        description="เงื่อนไขและข้อตกลงในการใช้งาน การอ้างอิง และการดาวน์โหลดผลงานวิจัยจากระบบคลังข้อมูลงานวิจัยมหาวิทยาลัย"
        canonicalUrl="https://udvc-research.online/terms"
      />

      <h1 className="text-3xl font-bold text-on-background">ข้อตกลงและเงื่อนไขการใช้งาน (Terms of Service)</h1>
      <p className="text-sm text-text-secondary">ปรับปรุงล่าสุด: 29 สิงหาคม 2026</p>

      <div className="bg-surface-main p-6 md:p-8 rounded-2xl border border-border-subtle space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">1. การยอมรับข้อตกลง</h2>
          <p>
            การเข้าใช้บริการระบบคลังข้อมูลงานวิจัยมหาวิทยาลัย ถือว่าท่านได้อ่าน เข้าใจ และตกลงที่จะปฏิบัติตามข้อตกลงและเงื่อนไขการใช้งานนี้ทุกประการ
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">2. สิทธิในทรัพย์สินทางปัญญาและการอ้างอิง</h2>
          <p>
            ผลงานวิจัย บทคัดย่อ และเอกสาร PDF ทั้งหมดในระบบเป็นลิขสิทธิ์ของผู้จัดทำวิจัยและสถาบันต้นสังกัด ผู้ใช้งานสามารถอ้างอิงข้อมูลเพื่อการศึกษาและวิจัยได้ โดยต้องให้เครดิตระบุชื่อผู้วิจัยและที่มาอย่างถูกต้อง
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-on-background">3. ข้อห้ามในการใช้งาน</h2>
          <p>
            ห้ามนำเนื้อหา เอกสาร หรือข้อมูลในระบบไปใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต ห้ามทำซ้ำ ดัดแปลง คัดลอกผลงาน (Plagiarism) หรือกระทำการใด ๆ ที่ละเมิดลิขสิทธิ์และกฎหมาย
          </p>
        </section>
      </div>
    </div>
  );
}
