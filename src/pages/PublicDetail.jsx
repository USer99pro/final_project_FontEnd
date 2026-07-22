import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getApiBase } from '../api/client';

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

  if (error) return <p className="error">{error}</p>;
  if (!work) return <p>กำลังโหลด...</p>;

  const fileUrl = work.fileUrl || `${getApiBase()}/api/public/projects/${id}/file`;
  const participants = work.participants || [];

  return (
    <div className="detail max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Link to="/" className="text-blue-600 hover:underline text-sm inline-block">← กลับไปหน้าค้นหา</Link>
      
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">{work.title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
          <span className="font-medium text-gray-900">ผู้จัดทำหลัก: {work.studentName || work.author?.fullName}</span>
          {work.major && <span>· สาขา: {work.major}</span>}
          {work.academicYear && <span>· ปีการศึกษา: {work.academicYear}</span>}
        </div>

        {/* Display Participants if available */}
        {participants.length > 0 && (
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs space-y-1">
            <span className="font-semibold text-blue-900">ผู้ร่วมจัดทำโครงการ:</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {participants.map((p, idx) => {
                const name = typeof p === 'object' ? p.fullName : p;
                const studentId = typeof p === 'object' && p.studentId ? ` (${p.studentId})` : '';
                return (
                  <span key={idx} className="inline-block bg-white px-2.5 py-1 rounded border border-blue-200 text-blue-800 font-medium">
                    {name}{studentId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {work.category?.name && <p><span className="font-medium text-gray-700">หมวดหมู่:</span> {work.category.name}</p>}
        {work.tags?.length > 0 && (
          <p>
            <span className="font-medium text-gray-700">คำสำคัญ / แท็ก:</span>{' '}
            {work.tags.map((t) => (typeof t === 'object' ? t.name : t)).join(', ')}
          </p>
        )}
      </div>

      <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">บทคัดย่อ / รายละเอียด</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {work.abstract || work.description || '— ไม่มีบทคัดย่อ —'}
        </p>
      </section>

      {work.hasPdf && (
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            เปิดเอกสาร PDF
          </a>
          <a
            href={`${fileUrl}?download=1`}
            className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-lg transition"
          >
            ดาวน์โหลด PDF
          </a>
        </div>
      )}
    </div>
  );
}
