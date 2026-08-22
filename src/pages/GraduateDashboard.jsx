import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  FileText,
  Activity,
  Clock,
  ArrowRight,
  User,
  BookOpen,
  CheckCircle,
  FileSignature,
  Edit,
  ChevronRight,
  History as HistoryIcon,
  GraduationCap,
} from "lucide-react";

export default function GraduateDashboard() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("/api/me/works"), api.get("/api/me/activity")])
      .then(([w, a]) => {
        setWorks(w.data.works || []);
        setActivity(a.data.activity || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            เผยแพร่แล้ว
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
            แบบร่าง
          </span>
        );
    }
  };

  const totalWorks = works.length;
  const publishedCount = works.filter((w) => w.status === "published").length;
  const draftCount = works.filter((w) => w.status === "draft").length;

  return (
    <div className="space-y-8 animate-fade-in pt-16">
      {/* ── PROFILE HEADER CARD ──────────────────────────────────── */}
      <div className="bg-surface-main rounded-3xl border border-border-subtle shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary-fixed/50">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-on-background leading-tight">
              แดชบอร์ดนักศึกษา
            </h1>
            <p className="text-text-secondary mt-1.5 text-sm md:text-base">
              ยินดีต้อนรับ,{" "}
              <span className="font-semibold text-on-background">
                {user?.fullName}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-outline">
              <span className="px-2.5 py-1 bg-surface-accent rounded-lg font-medium text-text-secondary">
                รหัสนักศึกษา: {user?.studentId}
              </span>
              <span className="px-2.5 py-1 bg-surface-accent rounded-lg font-medium text-text-secondary">
                สาขาวิชา: {user?.major}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/graduate/works/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:opacity-90 active:opacity-80 !text-white font-black text-sm rounded-xl border-2 border-primary-fixed shadow-[0_4px_14px_rgba(30,64,175,0.45)] focus:outline-none focus:ring-4 focus:ring-primary-fixed/40 transition-all duration-200 cursor-pointer opacity-100"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            <span>เพิ่มผลงานวิจัย</span>
          </Link>
          <Link
            to="/graduate/activity"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border-strong bg-surface-main text-on-background text-sm font-bold hover:bg-surface-muted hover:border-outline focus:outline-none focus:ring-2 focus:ring-outline transition-all duration-200 cursor-pointer"
          >
            <HistoryIcon className="w-4 h-4 text-text-secondary" />
            <span>ประวัติการดำเนินงาน</span>
          </Link>
        </div>
      </div>

      {/* ── STATS COUNTER GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Stat 1: Total Works */}
        <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
          <div className="space-y-1">
            <span className="text-sm font-medium text-outline">
              ผลงานทั้งหมด
            </span>
            <p className="text-3xl font-bold text-on-background">{totalWorks}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-insight-tint text-primary-container flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Published Works */}
        <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
          <div className="space-y-1">
            <span className="text-sm font-medium text-outline">
              เผยแพร่แล้ว
            </span>
            <p className="text-3xl font-bold text-emerald-600">
              {publishedCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Draft Works */}
        <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
          <div className="space-y-1">
            <span className="text-sm font-medium text-outline">
              แบบร่าง (Draft)
            </span>
            <p className="text-3xl font-bold text-amber-600">{draftCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileSignature className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN TABLES LAYOUT ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Works Card - 2 Columns wide on LG */}
        <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm overflow-hidden lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-primary-container to-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-white/80" />
                <h3 className="font-bold text-lg">ผลงานวิจัยล่าสุด</h3>
              </div>
              <Link
                to="/graduate/works"
                className="text-xs text-inverse-primary hover:text-white flex items-center gap-1 transition-colors font-semibold"
              >
                ดูทั้งหมด ({works.length}){" "}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-outline">
                กำลังโหลดข้อมูล...
              </div>
            ) : works.length === 0 ? (
              <div className="p-12 text-center text-outline flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-12 h-12 text-outline-variant" />
                <span>ยังไม่มีผลงานวิจัยในระบบ</span>
                <Link
                  to="/graduate/works/new"
                  className="text-sm text-primary-container font-bold hover:underline"
                >
                  + เพิ่มผลงานแรกของคุณ
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-muted border-b border-border-subtle">
                      <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider w-16 text-center">
                        ลำดับ
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
                        ชื่อผลงาน
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-center w-32">
                        ปีการศึกษา
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-center w-32">
                        สถานะ
                      </th>
                      <th className="px-6 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider text-center w-24">
                        แก้ไข
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {works.slice(0, 5).map((w, index) => (
                      <tr
                        key={w._id}
                        className="hover:bg-insight-tint/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm text-outline text-center font-semibold">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-on-background line-clamp-2 leading-relaxed">
                            {w.title}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 bg-surface-muted border border-border-subtle rounded-lg text-xs font-semibold text-on-surface-variant">
                            {w.academicYear || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {renderStatusBadge(w.status)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            to={`/graduate/works/${w._id}/edit`}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-insight-tint text-primary-container hover:bg-primary-container hover:text-white border border-primary-fixed/80 focus:outline-none focus:ring-2 focus:ring-primary-fixed transition-all duration-200 shadow-xs text-xs font-bold"
                            title="แก้ไขผลงาน"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {works.length > 5 && (
            <div className="bg-surface-muted/50 px-6 py-3 border-t border-border-subtle text-center">
              <Link
                to="/graduate/works"
                className="text-sm text-primary-container font-semibold hover:underline flex items-center justify-center gap-1.5"
              >
                ดูผลงานทั้งหมดเพิ่มเติม <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activities Card - 1 Column wide on LG */}
        <div className="bg-surface-main rounded-2xl border border-border-subtle shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-header-gradient-start to-header-gradient-end px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-white/80" />
                <h3 className="font-bold text-lg">กิจกรรมล่าสุด</h3>
              </div>
              <Link
                to="/graduate/activity"
                className="text-xs text-inverse-primary hover:text-white flex items-center gap-1 transition-colors"
              >
                ดูประวัติทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-outline">
                กำลังโหลดข้อมูล...
              </div>
            ) : activity.length === 0 ? (
              <div className="p-12 text-center text-outline flex flex-col items-center justify-center gap-3">
                <Clock className="w-12 h-12 text-outline-variant" />
                <span>ยังไม่มีกิจกรรมล่าสุด</span>
              </div>
            ) : (
              <div className="divide-y divide-border-subtle overflow-y-auto max-h-[360px] scrollbar-thin">
                {activity.slice(0, 5).map((a) => (
                  <div
                    key={a._id}
                    className="p-4 hover:bg-surface-muted/50 transition-colors duration-150 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-on-surface-variant line-clamp-2 leading-relaxed">
                        {a.contentId?.title || "ผลงานวิจัย"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-surface-accent rounded text-[10px] font-medium text-text-secondary">
                        {a.fromStatus || "ร่าง"}
                      </span>
                      <ArrowRight className="w-3 h-3 text-outline" />
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          a.toStatus === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {a.toStatus === "published" ? "เผยแพร่" : "ร่าง"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-outline">
                      <span>โดย {user?.fullName}</span>
                      <span>
                        {new Date(a.createdAt).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {activity.length > 5 && (
            <div className="bg-surface-muted/50 px-6 py-3 border-t border-border-subtle text-center">
              <Link
                to="/graduate/activity"
                className="text-sm text-text-secondary font-semibold hover:underline flex items-center justify-center gap-1.5"
              >
                ดูประวัติทั้งหมดเพิ่มเติม <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
