import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/api/admin/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1>แดชบอร์ดผู้ดูแลระบบ</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>ผู้ใช้ทั้งหมด</h3>
          <p>{data.users?.total}</p>
          <small>ใช้งาน {data.users?.active} · จบการศึกษา {data.users?.graduates}</small>
        </div>
        <div className="stat-card">
          <h3>ผลงานวิจัย</h3>
          <p>{data.works?.total}</p>
          <small>
            เผยแพร่ {data.works?.published} · ร่าง {data.works?.draft}
          </small>
        </div>
        <div className="stat-card">
          <h3>Login 7 วัน</h3>
          <p>{data.loginsLast7Days}</p>
        </div>
      </div>
      <div className="actions">
        <Link to="/admin/users" className="btn">
          จัดการผู้ใช้
        </Link>
        <Link to="/admin/works" className="btn">
          จัดการผลงาน
        </Link>
        <Link to="/admin/categories" className="btn btn-outline">
          หมวดหมู่/แท็ก
        </Link>
        <Link to="/admin/audit" className="btn btn-outline">
          ประวัติระบบ
        </Link>
        <a href={`${import.meta.env.VITE_API_URL}/api/admin/reports/export.csv`} className="btn btn-outline" target="_blank" rel="noreferrer">
          ดาวน์โหลดรายงาน CSV
        </a>
      </div>
    </div>
  );
}
