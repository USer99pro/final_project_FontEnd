import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import { ShieldAlert, LogIn, Clock, User, Activity, Calendar, Search, RotateCcw, Filter } from 'lucide-react';

export default function AuditLogs() {
  const [audit, setAudit] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/admin/audit-logs').catch(() => ({ data: { logs: [] } })),
      api.get('/api/admin/login-logs').catch(() => ({ data: { logs: [] } })),
    ])
      .then(([a, l]) => {
        setAudit(a.data.logs || a.data || []);
        setLogins(l.data.logs || l.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper to format date object to YYYY-MM-DD string for comparison
  const getDateIsoString = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Filter login logs
  const filteredLogins = useMemo(() => {
    return logins.filter((log) => {
      const rawDate = log.createdAt || log.timestamp;
      const logDate = rawDate ? new Date(rawDate) : null;
      const logDateIso = logDate ? getDateIsoString(logDate) : '';

      let matchDate = true;
      if (startDate && logDateIso < startDate) matchDate = false;
      if (endDate && logDateIso > endDate) matchDate = false;

      const userText = `${log.userId?.fullName || log.userName || ''} ${log.userId?.email || log.userEmail || ''}`.toLowerCase();
      const matchSearch = searchTerm ? userText.includes(searchTerm.toLowerCase()) : true;

      return matchDate && matchSearch;
    });
  }, [logins, startDate, endDate, searchTerm]);

  // Filter audit logs
  const filteredAudit = useMemo(() => {
    return audit.filter((log) => {
      const rawDate = log.createdAt || log.timestamp;
      const logDate = rawDate ? new Date(rawDate) : null;
      const logDateIso = logDate ? getDateIsoString(logDate) : '';

      let matchDate = true;
      if (startDate && logDateIso < startDate) matchDate = false;
      if (endDate && logDateIso > endDate) matchDate = false;

      const logText = `${log.action || ''} ${log.userId?.fullName || log.performedBy || ''}`.toLowerCase();
      const matchSearch = searchTerm ? logText.includes(searchTerm.toLowerCase()) : true;

      return matchDate && matchSearch;
    });
  }, [audit, startDate, endDate, searchTerm]);

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
        กำลังโหลดประวัติการใช้งาน...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ประวัติการทำงานและ Audit Logs</h1>
          <p className="text-sm text-gray-500">ตรวจสอบประวัติการเข้าสู่ระบบและประวัติกิจกรรมในระบบของผู้ใช้งาน</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="w-4 h-4 text-blue-600" />
            ตัวกรองประวัติการใช้งาน
          </div>
          {(startDate || endDate || searchTerm) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              ล้างตัวกรอง
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              วันที่เริ่มต้น (dd/mm/yyyy)
            </label>
            <div className="relative">
              <input
                type="date"
                lang="th-TH"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3.5 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* End Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              วันที่สิ้นสุด (dd/mm/yyyy)
            </label>
            <div className="relative">
              <input
                type="date"
                lang="th-TH"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3.5 py-2 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Search Term Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              ค้นหาด้วยชื่อ, อีเมล หรือ กิจกรรม
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="พิมพ์เพื่อค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3.5 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LOGIN LOGS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                <h2 className="font-bold text-lg">ประวัติการเข้าสู่ระบบ (Login Logs)</h2>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                {filteredLogins.length} รายการ
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
              {filteredLogins.length === 0 ? (
                <div className="p-8 text-center text-gray-400">ไม่พบประวัติการเข้าสู่ระบบตามเงื่อนไข</div>
              ) : (
                filteredLogins.map((log) => (
                  <div key={log._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{log.userId?.fullName || log.userName || '—'}</p>
                        <p className="text-xs text-gray-500">{log.userId?.email || log.userEmail || '—'}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.createdAt || log.timestamp).toLocaleString('th-TH')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AUDIT LOGS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-slate-800 to-gray-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <h2 className="font-bold text-lg">Audit Logs การทำงานในระบบ</h2>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                {filteredAudit.length} รายการ
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
              {filteredAudit.length === 0 ? (
                <div className="p-8 text-center text-gray-400">ไม่พบ Audit Logs ตามเงื่อนไข</div>
              ) : (
                filteredAudit.map((log) => (
                  <div key={log._id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500">โดย: {log.userId?.fullName || log.performedBy || 'System'}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.createdAt || log.timestamp).toLocaleString('th-TH')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
