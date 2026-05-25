import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function WorkManagement() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    api.get('/api/admin/works').then((res) => setWorks(res.data));
  }, []);

  const remove = async (id) => {
    if (!confirm('ลบผลงาน?')) return;
    await api.delete(`/api/contents/${id}`);
    setWorks((prev) => prev.filter((w) => w._id !== id));
  };

  return (
    <div>
      <h1>จัดการผลงานวิจัยทั้งหมด</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>นักศึกษา</th>
            <th>สาขา</th>
            <th>ปี</th>
            <th>สถานะ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {works.map((w) => (
            <tr key={w._id}>
              <td>{w.title}</td>
              <td>{w.studentName}</td>
              <td>{w.major}</td>
              <td>{w.academicYear}</td>
              <td>{w.status}</td>
              <td>
                <button type="button" className="btn-danger" onClick={() => remove(w._id)}>
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
