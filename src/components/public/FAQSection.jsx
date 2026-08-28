import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'สามารถค้นหางานวิจัยและวิทยานิพนธ์ได้อย่างไร?',
    a: 'ท่านสามารถใช้ช่องค้นหาที่หน้าหลักเพื่อพิมพ์ชื่อหัวเรื่อง คำสำคัญ (Keywords) ชื่อนักศึกษา หรือเลือกกรองตามสาขาวิชาและปีการศึกษาเพื่อค้นหาผลงานวิจัยที่สนใจได้อย่างสะดวกและรวดเร็ว',
  },
  {
    q: 'ผู้ใช้งานทั่วไปสามารถดาวน์โหลดไฟล์เอกสารวิจัยฉบับเต็ม (PDF) ได้หรือไม่?',
    a: 'งานวิจัยที่ได้รับการอนุมัติเผยแพร่ต่อสาธารณะ ท่านสามารถกดเปิดดูหรือดาวน์โหลดไฟล์เอกสาร PDF ฉบับเต็มได้ทันทีโดยไม่มีค่าใช้จ่าย',
  },
  {
    q: 'หากต้องการส่งผลงานวิจัยเข้าสู่คลังข้อมูล ต้องทำอย่างไร?',
    a: 'นักศึกษาและบุคลากรสามารถสมัครสมาชิกเข้าสู่ระบบ เลือกเมนู "ผลงานของฉัน" เพื่อยื่นส่งผลงานวิจัย บทคัดย่อ และเอกสารประกอบ เพื่อรอการตรวจสอบและอนุมัติจากผู้ดูแลระบบต่อไป',
  },
  {
    q: 'ระบบคลังข้อมูลงานวิจัยนี้ครอบคลุมสาขาวิชาใดบ้าง?',
    a: 'คลังข้อมูลของเรารวบรวมผลงานวิชาการครอบคลุมสาขาวิทยาการคอมพิวเตอร์, เทคโนโลยีสารสนเทศ, บริหารธุรกิจ, มัลติมีเดีย, วิศวกรรมศาสตร์ และสาขาอื่น ๆ ที่เกี่ยวข้อง',
  },
];

export default function FAQSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section className="py-12 px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-insight-tint text-primary-container border border-primary-fixed mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            คำถามที่พบบ่อย (FAQ)
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-background">
            คำถามที่พบบ่อยเกี่ยวกับการใช้งานคลังวิจัย
          </h2>
          <p className="text-sm text-text-secondary mt-2">
            ไขข้อสงสัยเกี่ยวกับการค้นหา การสืบค้น และการเผยแพร่ผลงานทางวิชาการ
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-surface-main p-5 rounded-2xl border border-border-subtle group transition-all duration-200 cursor-pointer"
            >
              <summary className="font-semibold text-on-background text-base md:text-lg list-none flex items-center justify-between gap-4">
                <span>{faq.q}</span>
                <span className="text-primary text-xl font-bold transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="text-body-md text-text-secondary mt-3 pt-3 border-t border-border-subtle leading-relaxed">
                {faq.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
