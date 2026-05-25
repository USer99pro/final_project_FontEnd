import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ActivityHistory() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get('/api/me/activity').then((res) => setActivity(res.data.activity || []));
  }, []);

  return (
    <div>
      <h1>ประวัติการดำเนินงาน</h1>
      <ul className="list">
        {activity.map((a) => (
          <li key={a._id}>
            <strong>{a.contentId?.title || 'ผลงาน'}</strong>: {a.fromStatus || '—'} → {a.toStatus}
            {a.note && ` (${a.note})`}
            <br />
            <small>{new Date(a.createdAt).toLocaleString('th-TH')}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
