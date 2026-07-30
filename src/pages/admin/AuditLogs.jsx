import { useEffect, useState } from 'react';
import api from '../../api/client';
import { ShieldAlert, LogIn, Clock, User, Activity } from 'lucide-react';

export default function AuditLogs() {
  const [audit, setAudit] = useState([]);
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
        กำลังโหลดประวัติการใช้งาน...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pt-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ประวัติการทำงานและ Audit Logs</h1>
        <p className="text-sm text-gray-500">ตรวจสอบประวัติการเข้าสู่ระบบและประวัติกิจกรรมในระบบของผู้ใช้งาน</p>
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
                {logins.length} รายการ
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
              {logins.length === 0 ? (
                <div className="p-8 text-center text-gray-400">ยังไม่มีประวัติการเข้าสู่ระบบ</div>
              ) : (
                logins.map((log) => (
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
                {audit.length} รายการ
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
              {audit.length === 0 ? (
                <div className="p-8 text-center text-gray-400">ยังไม่มี Audit Logs</div>
              ) : (
                audit.map((log) => (
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

