import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function MyWorks() {
  const [works, setWorks] = useState([]);

  const load = () => api.get('/api/me/works').then((res) => setWorks(res.data.works || []));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('ลบผลงานนี้?')) return;
    await api.delete(`/api/contents/${id}`);
    load();
  };

  return (
    <div>
      <h1>ผลงานวิจัยของฉัน</h1>
      <Link to="/graduate/works/new" className="btn">
        + เพิ่มผลงาน
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>ชื่อผลงาน</th>
            <th>ปี</th>
            <th>สถานะ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {works.map((w) => (
            <tr key={w._id}>
              <td>{w.title}</td>
              <td>{w.academicYear}</td>
              <td>
                <span className={`status ${w.status}`}>{w.status}</span>
              </td>
              <td>
                <Link to={`/graduate/works/${w._id}/edit`}>แก้ไข</Link>
                <button type="button" className="btn-danger" onClick={() => handleDelete(w._id)}>
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
