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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-indigo-100 via-white to-blue-100">
  
      {/* CARD */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40">
  
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-10 text-center text-white">
  
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-lg">
            R
          </div>
  
          <h1 className="text-3xl font-bold mt-5">
            สมัครสมาชิก
          </h1>
  
          <p className="text-indigo-100 mt-2 text-sm">
            สำหรับนักศึกษาที่จบการศึกษา
          </p>
        </div>
  
        {/* FORM */}
        <div className="p-8">
  
          <form onSubmit={handleSubmit} className="space-y-5">
  
            {/* STUDENT ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสนักศึกษา
              </label>
  
              <input
                value={form.studentId}
                onChange={set('studentId')}
                required
                placeholder="6500000000"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
  
            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ–นามสกุล
              </label>
  
              <input
                value={form.fullName}
                onChange={set('fullName')}
                required
                placeholder="ชื่อ นามสกุล"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
  
            {/* MAJOR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สาขาวิชา
              </label>
  
              <select
                value={form.major}
                onChange={set('major')}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
              >
                <option value="" disabled>-- เลือกสาขาวิชา --</option>
                  <option value="สาขาวิชาการบัญชี">สาขาวิชาการบัญชี</option>
                  <option value="สาขาวิชาการตลาด">สาขาวิชาการตลาด</option>
                  <option value="สาขาวิชาการจัดการธุรกิจค้าปลีก">สาขาวิชาการจัดการธุรกิจค้าปลีก</option>
                  <option value="สาขาวิชาการจัดการสำนักงานดิจิทัล">สาขาวิชาการจัดการสำนักงานดิจิทัล</option>
                  <option value="สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล">สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล</option>
                  <option value="สาขาวิชาเทคโนโลยีสารสนเทศ">สาขาวิชาเทคโนโลยีสารสนเทศ</option>
                  <option value="สาขาวิชาการจัดการโลจิสติกส์และซัพพลายเชน">สาขาวิชาการจัดการโลจิสติกส์และซัพพลายเชน</option>
                  <option value="สาขาวิชาธุรกิจการบิน">สาขาวิชาธุรกิจการบิน</option>
                  <option value="สาขาวิชาดิจิทัลกราฟิก">สาขาวิชาดิจิทัลกราฟิก</option>
                  <option value="สาขาวิชาเทคโนโลยีแฟชั่นและเครื่องแต่งกาย">สาขาวิชาเทคโนโลยีแฟชั่นและเครื่องแต่งกาย</option>
                  <option value="สาขาวิชาอาหารและโภชนาการ">สาขาวิชาอาหารและโภชนาการ</option>
                  <option value="สาขาวิชาการบริหารงานคหกรรมศาสตร์">สาขาวิชาการบริหารงานคหกรรมศาสตร์</option>
                  <option value="สาขาวิชาการโรงแรม">สาขาวิชาการโรงแรม</option>
                  <option value="สาขาวิชาการท่องเที่ยว">สาขาวิชาการท่องเที่ยว</option>
              
              </select>
            </div>
  
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
  
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
  
            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
  
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
  
            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ยืนยันรหัสผ่าน
              </label>
  
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                required
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
  
            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
  
            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition duration-300"
            >
              สมัครสมาชิก
            </button>
  
          </form>
  
          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-gray-600">
            มีบัญชีแล้ว?
            <Link
              to="/login"
              className="ml-2 font-semibold text-indigo-600 hover:text-blue-600 transition"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
  
        </div>
      </div>
    </div>
  );
}
