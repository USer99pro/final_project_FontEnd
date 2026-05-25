import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function GraduateDashboard() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/api/me/works'), api.get('/api/me/activity')]).then(([w, a]) => {
      setWorks(w.data.works || []);
      setActivity(a.data.activity || []);
    });
  }, []);

  return (
    <div>
      <h1>แดชบอร์ด — {user?.fullName}</h1>
      <p>
        รหัส {user?.studentId} · {user?.major}
      </p>
      <div className="actions">
        <Link to="/graduate/works/new" className="btn">
          + เพิ่มผลงานวิจัย
        </Link>
        <Link to="/graduate/activity" className="btn btn-outline">
          ประวัติการดำเนินงาน
        </Link>
      </div>
      <h2>ผลงานล่าสุด ({works.length})</h2>
      <ul className="list">
        {works.slice(0, 5).map((w) => (
          <li key={w._id}>
            <Link to={`/graduate/works/${w._id}/edit`}>{w.title}</Link> — <span className={`status ${w.status}`}>{w.status}</span>
          </li>
        ))}
      </ul>
      <h2>กิจกรรมล่าสุด</h2>
      <ul className="list">
        {activity.slice(0, 5).map((a) => (
          <li key={a._id}>
            {a.contentId?.title || 'ผลงาน'}: {a.fromStatus} → {a.toStatus} ({new Date(a.createdAt).toLocaleString('th-TH')})
          </li>
        ))}
      </ul>
    </div>
  );
}
