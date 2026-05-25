import { Link } from 'react-router-dom';

export default function WorkCard({ work }) {
  return (
    <article className="work-card">
      <h3>
        <Link to={`/projects/${work._id}`}>{work.title}</Link>
      </h3>
      <p className="meta">
        {work.studentName} · {work.major} · ปี {work.academicYear || '-'}
      </p>
      {work.abstract && (
        <p className="abstract">
          {work.abstract.length > 160 ? `${work.abstract.slice(0, 160)}...` : work.abstract}
        </p>
      )}
      {work.hasPdf && (
        <a href={work.fileUrl || work.pdfUrl} target="_blank" rel="noreferrer" className="btn-sm">
          เปิด PDF
        </a>
      )}
    </article>
  );
}
