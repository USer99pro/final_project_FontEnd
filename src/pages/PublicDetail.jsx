import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getApiBase } from '../api/client';
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
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-md mx-auto">
        <p className="font-semibold text-base mb-4">{error}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition">
          <ArrowLeft className="w-4 h-4" /> กลับไปหน้าค้นหา
        </Link>
      </div>
    </div>
  );

  if (!work) return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center text-slate-500 font-medium">
      กำลังโหลดข้อมูล...
    </div>
  );

  const fileUrl = work.fileUrl || `${getApiBase()}/api/public/projects/${id}/file`;
  const participants = work.participants || [];
  const advisors = work.advisors?.length ? work.advisors : work.advisor ? [work.advisor] : [];

  return (
    <div className="detail max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition">
        <ArrowLeft className="w-4 h-4" />
        กลับไปหน้าค้นหา
      </Link>
      
      <div className="space-y-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">{work.title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 border-b border-slate-100 pb-4 font-medium">
          <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
            <User className="w-4 h-4 text-blue-600" />
            ผู้จัดทำหลัก: {work.studentName || work.author?.fullName}
          </span>
          {work.major && (
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              สาขา: {work.major}
            </span>
          )}
          {work.academicYear && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              ปีการศึกษา: {work.academicYear}
            </span>
          )}
        </div>

        {/* Display Participants if available */}
        {participants.length > 0 && (
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              ผู้ร่วมจัดทำโครงการ:
            </span>
            <div className="flex flex-wrap gap-2">
              {participants.map((p, idx) => {
                const name = typeof p === 'object' ? p.fullName : p;
                const studentId = typeof p === 'object' && p.studentId ? ` (${p.studentId})` : '';
                return (
                  <span key={idx} className="inline-block bg-white px-3 py-1.5 rounded-xl border border-blue-200 text-blue-900 font-semibold shadow-xs">
                    {name}{studentId}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {advisors.length > 0 && (
          <div className="p-4 bg-violet-50/70 border border-violet-100 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-violet-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-violet-600" />
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
                  <span key={idx} className="inline-block bg-white px-3 py-1.5 rounded-xl border border-violet-200 text-violet-900 font-semibold shadow-xs">
                    {name}{position}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-slate-600 pt-2">
          {work.category?.name && (
            <p className="flex items-center gap-2 font-medium">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">หมวดหมู่:</span> {work.category.name}
            </p>
          )}
          {work.tags?.length > 0 && (
            <p className="flex items-center gap-2 font-medium">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">คำสำคัญ / แท็ก:</span>{' '}
              {work.tags.map((t) => (typeof t === 'object' ? t.name : t)).join(', ')}
            </p>
          )}
        </div>
      </div>

      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-slate-900">บทคัดย่อ / รายละเอียด</h2>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {work.abstract || work.description || '— ไม่มีบทคัดย่อ —'}
        </p>
      </section>

      {work.hasPdf && (
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] !text-white font-black text-sm rounded-xl border-2 border-blue-300 shadow-[0_4px_14px_rgba(30,64,175,0.45)] focus:outline-none focus:ring-4 focus:ring-blue-400/40 transition-all duration-200 cursor-pointer opacity-100"
          >
            <FileText className="w-4 h-4 text-white" />
            เปิดเอกสาร PDF
          </a>
          <a
            href={`${fileUrl}?download=1`}
            className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            ดาวน์โหลด PDF
          </a>
        </div>
      )}
    </div>
  );
}
