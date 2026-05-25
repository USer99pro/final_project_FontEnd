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

  return (
    <div className="detail">
      <Link to="/">← กลับ</Link>
      <h1>{work.title}</h1>
      <p className="meta">
        {work.studentName} · {work.major} · ปี {work.academicYear || '-'}
      </p>
      {work.category?.name && <p>หมวดหมู่: {work.category.name}</p>}
      {work.tags?.length > 0 && <p>แท็ก: {work.tags.map((t) => t.name).join(', ')}</p>}
      <section>
        <h2>บทคัดย่อ</h2>
        <p>{work.abstract || work.description || '—'}</p>
      </section>
      {work.hasPdf && (
        <div className="actions">
          <a href={fileUrl} target="_blank" rel="noreferrer" className="btn">
            เปิดเอกสาร PDF
          </a>
          <a href={`${fileUrl}?download=1`} className="btn btn-outline">
            ดาวน์โหลด
          </a>
        </div>
      )}
    </div>
  );
}
