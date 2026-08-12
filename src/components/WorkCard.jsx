import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar, User, Building } from 'lucide-react';

export default function WorkCard({ work }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            {work.category?.name || work.major || 'ผลงานวิจัย'}
          </span>
          {work.academicYear && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              ปี {work.academicYear}
            </span>
          )}
        </div>

        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/projects/${work._id}`} className="focus:outline-none focus:underline">
            {work.title}
          </Link>
        </h3>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3 font-medium">
          {work.studentName && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {work.studentName}
            </span>
          )}
          {work.major && (
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {work.major}
            </span>
          )}
        </div>

        {work.abstract && (
          <p className="text-xs md:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
            {work.abstract}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <Link
          to={`/projects/${work._id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 border border-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer"
        >
          รายละเอียด
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {(work.hasPdf || work.pdfFilename || work.pdfUrl) && (
          <a
            href={work.fileUrl || work.pdfUrl || `/api/public/projects/${work._id}/file`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/40 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-red-500" />
            เปิด PDF
          </a>
        )}
      </div>
    </article>
  );
}
