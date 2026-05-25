import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    studentId: '',
    fullName: '',
    major: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/graduate');
    } catch (err) {
      setError(err.response?.data?.error || 'สมัครไม่สำเร็จ');
    }
  };

  return (
    <div className="auth-form">
      <h1>สมัครสมาชิก</h1>
      <p>นักศึกษาที่จบการศึกษา</p>
      <form onSubmit={handleSubmit}>
        <label>
          รหัสนักศึกษา
          <input value={form.studentId} onChange={set('studentId')} required />
        </label>
        <label>
          ชื่อ–นามสกุล
          <input value={form.fullName} onChange={set('fullName')} required />
        </label>
        <label>
          สาขาวิชา
          <input value={form.major} onChange={set('major')} required />
        </label>
        <label>
          อีเมล
          <input type="email" value={form.email} onChange={set('email')} required />
        </label>
        <label>
          รหัสผ่าน
          <input type="password" value={form.password} onChange={set('password')} required minLength={6} />
        </label>
        <label>
          ยืนยันรหัสผ่าน
          <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">สมัครสมาชิก</button>
      </form>
      <p>
        มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
