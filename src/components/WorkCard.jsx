import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar, User, Building } from 'lucide-react';

export default function WorkCard({ work }) {
  return (
    <article className="bg-surface-main rounded-2xl border border-border-subtle p-5 md:p-6 shadow-sm hover:shadow-md hover:border-primary-fixed transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-insight-tint text-primary-container border border-primary-fixed">
            {work.category?.name || work.major || 'ผลงานวิจัย'}
          </span>
          {work.academicYear && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary font-medium">
              <Calendar className="w-3.5 h-3.5 text-outline" />
              ปี {work.academicYear}
            </span>
          )}
        </div>

        <h3 className="text-base md:text-lg font-bold text-on-background mb-2 line-clamp-2 group-hover:text-primary-container transition-colors">
          <Link to={`/projects/${work._id}`} className="focus:outline-none focus:underline">
            {work.title}
          </Link>
        </h3>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-text-secondary mb-3 font-medium">
          {work.studentName && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-outline" />
              {work.studentName}
            </span>
          )}
          {work.major && (
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-outline" />
              {work.major}
            </span>
          )}
        </div>

        {work.abstract && (
          <p className="text-xs md:text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
            {work.abstract}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2 mt-2">
        <Link
          to={`/projects/${work._id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-primary-container bg-insight-tint hover:bg-insight-tint hover:text-primary border border-primary-fixed/60 focus:outline-none focus:ring-2 focus:ring-primary-fixed/40 transition-all cursor-pointer"
        >
          รายละเอียด
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {(work.hasPdf || work.pdfFilename || work.pdfUrl) && (
          <a
            href={work.fileUrl || work.pdfUrl || `/api/public/projects/${work._id}/file`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant bg-surface-accent hover:bg-surface-container-low hover:text-on-background border border-border-subtle focus:outline-none focus:ring-2 focus:ring-outline/40 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-error" />
            เปิด PDF
          </a>
        )}
      </div>
    </article>
  );
}
