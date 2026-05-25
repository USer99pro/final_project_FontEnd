import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AuditLogs() {
  const [audit, setAudit] = useState([]);
  const [logins, setLogins] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/api/admin/audit-logs'), api.get('/api/admin/login-logs')]).then(([a, l]) => {
      setAudit(a.data.logs || []);
      setLogins(l.data.logs || []);
    });
  }, []);

  return (
    <div>
      <h1>ประวัติการใช้งาน</h1>
      <h2>เข้าสู่ระบบล่าสุด</h2>
      <ul className="list">
        {logins.map((log) => (
          <li key={log._id}>
            {log.userId?.fullName || '—'} ({log.userId?.email}) — {new Date(log.createdAt).toLocaleString('th-TH')}
          </li>
        ))}
      </ul>
      <h2>Audit logs</h2>
      <ul className="list">
        {audit.map((log) => (
          <li key={log._id}>
            {log.action} — {log.userId?.fullName || 'system'} — {new Date(log.createdAt).toLocaleString('th-TH')}
          </li>
        ))}
      </ul>
    </div>
  );
}
