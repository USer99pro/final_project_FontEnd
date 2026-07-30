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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition duration-300 cursor-pointer"
            >
              สมัครสมาชิก
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">หรือ</span>
            </div>
          </div>

          {/* GOOGLE OAUTH BUTTON */}
          <a
            href={`${import.meta.env.VITE_API_URL || ''}/api/auth/google`}
            className="w-full py-3 px-4 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm hover:shadow transition duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            สมัคร/เข้าสู่ระบบด้วย Google
          </a>
  
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
