import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getApiBase } from '../api/client';
import SEOHead from '../components/SEOHead';
import { ArrowLeft, FileText, Download, User, Building, Calendar, BookOpen, GraduationCap, Tag } from 'lucide-react';

export default function PublicDetail() {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/api/public/projects/${id}`)
      .then((res) => setWork(res.data))
      .catch(() => setError('ไม่พบผลงานหรือยังไม่เผยแพร่'));
  }, [id]);

  if (error) return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <SEOHead title="ไม่พบผลงาน | คลังข้อมูลงานวิจัยมหาวิทยาลัย" />
      <div className="bg-error-container border border-error/30 text-error p-6 rounded-2xl max-w-md mx-auto">
        <p className="font-semibold text-base mb-4">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-error text-white rounded-xl font-semibold text-sm hover:opacity-90 transition">
          <ArrowLeft className="w-4 h-4" /> กลับไปหน้าค้นหา
        </Link>
      </div>
    </div>
  );

  if (!work) return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center text-text-secondary font-medium">
      <SEOHead title="กำลังโหลดข้อมูลงานวิจัย... | คลังข้อมูลงานวิจัยมหาวิทยาลัย" />
      กำลังโหลดข้อมูล...
    </div>
  );

  const fileUrl = work.fileUrl || `${getApiBase()}/api/public/projects/${id}/file`;
  const participants = work.participants || [];
  const advisors = work.advisors?.length ? work.advisors : work.advisor ? [work.advisor] : [];
  const authorName = work.studentName || work.author?.fullName || 'UDVC Researcher';
  const abstractText = work.abstract || work.description || 'บทคัดย่อผลงานวิจัยและวิทยานิพนธ์ทางวิชาการ';

  // Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: work.title,
    description: abstractText.slice(0, 200),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    inLanguage: 'th',
    url: `https://udvc-research.online/projects/${id}`,
    datePublished: work.createdAt || new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'คลังข้อมูลงานวิจัยมหาวิทยาลัย',
    },
  };

  return (
    <div className="detail max-w-4xl mx-auto py-8 px-4 space-y-6">
      <SEOHead
        title={`${work.title} | คลังข้อมูลงานวิจัยมหาวิทยาลัย`}
        description={abstractText.slice(0, 160)}
        canonicalUrl={`https://udvc-research.online/projects/${id}`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-on-surface-variant bg-surface-main border border-border-subtle rounded-xl hover:bg-surface-muted hover:text-primary-container shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed/40 transition">
        <ArrowLeft className="w-4 h-4" />
        กลับไปหน้าค้นหา
      </Link>
      
      <div className="space-y-4 bg-surface-main p-6 md:p-8 rounded-3xl border border-border-subtle shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-on-background leading-snug">{work.title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary border-b border-border-subtle pb-4 font-medium">
          <span className="flex items-center gap-1.5 text-on-background font-semibold">
            <User className="w-4 h-4 text-primary-container" />
            ผู้จัดทำหลัก: {authorName}
          </span>
          {work.major && (
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-outline" />
              สาขา: {work.major}
            </span>
          )}
          {work.academicYear && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-outline" />
              ปีการศึกษา: {work.academicYear}
            </span>
          )}
        </div>

        {/* Display Participants if available */}
        {participants.length > 0 && (
          <div className="p-4 bg-insight-tint/70 border border-primary-fixed rounded-2xl text-xs space-y-2">
            <span className="font-bold text-primary text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-primary-container" />
              ผู้ร่วมจัดทำโครงการ:
            </span>
            <div className="flex flex-wrap gap-2">
              {participants.map((p, idx) => {
                const name = typeof p === 'object' ? p.fullName : p;
                const studentId = typeof p === 'object' && p.studentId ? ` (${p.studentId})` : '';
                return (
                  <span key={idx} className="inline-block bg-surface-main px-3 py-1.5 rounded-xl border border-primary-fixed text-primary font-semibold shadow-xs">
                    {name}{studentId}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {advisors.length > 0 && (
          <div className="p-4 bg-insight-tint/60 border border-primary-fixed rounded-2xl text-xs space-y-2">
            <span className="font-bold text-primary text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-container" />
              ครูที่ปรึกษา:
            </span>
            <div className="flex flex-wrap gap-2">
              {advisors.map((advisor, idx) => {
                const name =
                  typeof advisor === 'object'
                    ? `${advisor.prefix || ''} ${advisor.fullName || ''}`.trim()
                    : advisor;
                const position = typeof advisor === 'object' && advisor.academicPosition ? ` (${advisor.academicPosition})` : '';
                return (
                  <span key={idx} className="inline-block bg-surface-main px-3 py-1.5 rounded-xl border border-primary-fixed text-primary font-semibold shadow-xs">
                    {name}{position}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-text-secondary pt-2">
          {work.category?.name && (
            <p className="flex items-center gap-2 font-medium">
              <BookOpen className="w-4 h-4 text-outline" />
              <span className="font-semibold text-on-background">หมวดหมู่:</span> {work.category.name}
            </p>
          )}
          {work.tags?.length > 0 && (
            <p className="flex items-center gap-2 font-medium">
              <Tag className="w-4 h-4 text-outline" />
              <span className="font-semibold text-on-background">คำสำคัญ / แท็ก:</span>{' '}
              {work.tags.map((t) => (typeof t === 'object' ? t.name : t)).join(', ')}
            </p>
          )}
        </div>
      </div>

      <section className="bg-surface-main p-6 md:p-8 rounded-3xl border border-border-subtle shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-on-background">บทคัดย่อ / รายละเอียด</h2>
        <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-sm md:text-base">
          {work.abstract || work.description || '— ไม่มีบทคัดย่อ —'}
        </p>
      </section>

      {work.hasPdf && (
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:opacity-90 active:opacity-80 !text-white font-black text-sm rounded-xl border-2 border-primary-fixed shadow-[0_4px_14px_rgba(30,64,175,0.45)] focus:outline-none focus:ring-4 focus:ring-primary-fixed/40 transition-all duration-200 cursor-pointer opacity-100"
          >
            <FileText className="w-4 h-4 text-white" />
            เปิดเอกสาร PDF
          </a>
          <a
            href={`${fileUrl}?download=1`}
            className="px-6 py-3 bg-surface-main border border-border-strong hover:bg-surface-muted active:bg-surface-accent text-on-background font-bold text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-outline transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-text-secondary" />
            ดาวน์โหลด PDF
          </a>
        </div>
      )}
    </div>
  );
}
