import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [resetId, setResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const load = () => api.get('/api/users').then((res) => setUsers(res.data));

  useEffect(() => {
    load();
  }, []);

  const suspend = (id) => api.patch(`/api/admin/users/${id}/suspend`).then(load);
  const activate = (id) => api.patch(`/api/admin/users/${id}/activate`).then(load);
  const setRole = (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }).then(load);

  const resetPassword = async () => {
    if (!resetId || !newPassword) return;
    await api.post(`/api/admin/users/${resetId}/reset-password`, { newPassword });
    setNewPassword('');
    alert('รีเซ็ตรหัสผ่านสำเร็จ');
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      'คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/users/${id}`);

      // รีเฟรชข้อมูล
      load();

      alert('ลบผู้ใช้งานสำเร็จ');
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
        'ไม่สามารถลบผู้ใช้งานได้'
      );
    }
  };
  return (
    <div>
      <h1>จัดการผู้ใช้งาน</h1>
      <div className="inline-form">
        <input placeholder="User ID" value={resetId} onChange={(e) => setResetId(e.target.value)} />
        <input placeholder="รหัสผ่านใหม่" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button type="button" onClick={resetPassword}>
          รีเซ็ตรหัสผ่าน
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>อีเมล</th>
            <th>สาขา</th>
            <th>role</th>
            <th>สถานะ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.studentId}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.major}</td>
              <td>
                <select value={u.role} onChange={(e) => setRole(u._id, e.target.value)}>
                  <option value="graduate">graduate</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>{u.isActive === false ? 'ระงับ' : 'ใช้งาน'}</td>
              <td>
                <div className="flex gap-2">
                  {u.isActive === false ? (
                    <button
                      type="button"
                      onClick={() => activate(u._id)}
                    >
                      เปิดใช้
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => suspend(u._id)}
                    >
                      ระงับ
                    </button>
                  )}

                  <button
                    type="button"
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => deleteUser(u._id)}
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
