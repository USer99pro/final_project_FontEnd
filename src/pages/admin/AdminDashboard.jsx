import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Users, BookOpen, Activity, Download, Settings, FileText, Layers, ShieldCheck, GraduationCap, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExportCsv = useCallback(async () => {
    setExporting(true);
    try {
      const res = await api.get('/api/admin/reports/export.csv', {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().slice(0, 10);
      link.download = `research-report-${date}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.error || 'ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setExporting(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/admin/dashboard').catch(() => ({ data: null })),
      api.get('/api/admin/reports/summary').catch(() => ({ data: null })),
    ])
      .then(([dashRes, sumRes]) => {
        setData(dashRes.data);
        setSummary(sumRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
        กำลังโหลดข้อมูลผู้ดูแลระบบ...
      </div>
    );
  }

  const userStats = data?.users || summary?.users || { total: 0, active: 0, graduates: 0 };
  const workStats = data?.works || summary?.works || { total: 0, published: 0, draft: 0 };
  const logins7 = data?.loginsLast7Days ?? summary?.loginsLast7Days ?? 0;

  return (
    <div className="space-y-8 animate-fade-in pt-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 mb-3 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Admin Panel
          </div>
          <h1 className="text-3xl font-bold">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-blue-200 text-sm mt-1">
            การบริหารจัดการระบบ รายงานสถิติ และการควบคุมสิทธิ์การใช้งาน
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-400/50 transition-all transform hover:-translate-y-0.5 disabled:cursor-not-allowed cursor-pointer"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{exporting ? 'กำลังส่งออก...' : 'ส่งออกรายงาน CSV'}</span>
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">ผู้ใช้งานทั้งหมด</span>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{userStats.total || 0}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded">
              ใช้งาน {userStats.active || 0}
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded">
              จบการศึกษา {userStats.graduates || 0}
            </span>
          </div>
        </div>

        {/* Works Stat */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">ผลงานวิจัยทั้งหมด</span>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{workStats.total || 0}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded">
              เผยแพร่ {workStats.published || 0}
            </span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-medium rounded">
              แบบร่าง {workStats.draft || 0}
            </span>
          </div>
        </div>

        {/* Logins 7 Days */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">การเข้าสู่ระบบ 7 วันล่าสุด</span>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-4">{logins7}</p>
          <p className="text-xs text-gray-400 mt-2">สถิติการใช้งานจาก Login Logs</p>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">เมนูการจัดการระบบ (Admin Controls)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <Link
            to="/admin/users"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">จัดการผู้ใช้</h3>
              <p className="text-xs text-gray-400">สิทธิ์ บทบาท การระงับผู้ใช้</p>
            </div>
          </Link>

          <Link
            to="/admin/works"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">จัดการผลงาน</h3>
              <p className="text-xs text-gray-400">อนุมัติ ลบ และแก้ไขโครงการ</p>
            </div>
          </Link>

          <Link
            to="/admin/advisors"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-teal-500 hover:shadow-md transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition">ครูที่ปรึกษา</h3>
              <p className="text-xs text-gray-400">เพิ่ม แก้ไข ลบ รายชื่อครู</p>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-md transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">หมวดหมู่/แท็ก</h3>
              <p className="text-xs text-gray-400">จัดการข้อมูลหลักในระบบ</p>
            </div>
          </Link>

          <Link
            to="/admin/audit"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-slate-500 hover:shadow-md transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-slate-800 transition">ประวัติระบบ Logs</h3>
              <p className="text-xs text-gray-400">Audit Logs & History</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

