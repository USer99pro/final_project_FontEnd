import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    studentId: user?.studentId || '',
    fullName: user?.fullName || '',
    major: user?.major || '',
    phone: user?.phone || '',
    password: '',
  });
  const [msg, setMsg] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form };
    if (!body.password) delete body.password;
    try {
      await api.patch(`/api/users/${user._id}`, body);
      setMsg('บันทึกโปรไฟล์สำเร็จ');
    } catch (err) {
      setMsg(err.response?.data?.error || 'บันทึกไม่สำเร็จ');
    }
  };

  return (
    <div className="form-page">
      <h1>ข้อมูลส่วนตัว</h1>
      <form onSubmit={handleSubmit}>
        <label>
          รหัสนักศึกษา
          <input value={form.studentId} onChange={set('studentId')} />
        </label>
        <label>
          ชื่อ–นามสกุล
          <input value={form.fullName} onChange={set('fullName')} />
        </label>
        <label>
          สาขาวิชา
          <input value={form.major} onChange={set('major')} />
        </label>
        <label>
          เบอร์โทร
          <input value={form.phone} onChange={set('phone')} />
        </label>
        <label>
          รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
          <input type="password" value={form.password} onChange={set('password')} />
        </label>
        {msg && <p>{msg}</p>}
        <button type="submit">บันทึก</button>
      </form>
    </div>
  );
}
