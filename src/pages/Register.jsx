import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackAnalyticsEvent } from '../api/analyticsService';
import SearchableSelect from '../components/SearchableSelect';
import { UserPlus } from 'lucide-react';

const MAJOR_OPTIONS = [
  'สาขาวิชาการบัญชี',
  'สาขาวิชาการตลาด',
  'สาขาวิชาการจัดการธุรกิจค้าปลีก',
  'สาขาวิชาการจัดการสำนักงานดิจิทัล',
  'สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล',
  'สาขาวิชาเทคโนโลยีสารสนเทศ',
  'สาขาวิชาการจัดการโลจิสติกส์และซัพพลายเชน',
  'สาขาวิชาธุรกิจการบิน',
  'สาขาวิชาดิจิทัลกราฟิก',
  'สาขาวิชาเทคโนโลยีแฟชั่นและเครื่องแต่งกาย',
  'สาขาวิชาอาหารและโภชนาการ',
  'สาขาวิชาการบริหารงานคหกรรมศาสตร์',
  'สาขาวิชาการโรงแรม',
  'สาขาวิชาการท่องเที่ยว',
];

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

    if (!form.studentId.trim()) {
      setError('กรุณากรอกรหัสนักศึกษา');
      return;
    }
    if (!form.fullName.trim()) {
      setError('กรุณากรอกชื่อ–นามสกุล');
      return;
    }
    if (!form.major) {
      setError('กรุณาเลือกสาขาวิชา');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const user = await register(form);
      trackAnalyticsEvent({
        event: 'REGISTER',
        page: '/register',
        userId: user?._id || user?.id || null,
      });
      navigate('/graduate');
    } catch (err) {
      setError(err.response?.data?.error || 'สมัครไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-surface-container-low via-surface-main to-surface-container">

      {/* CARD */}
      <div className="w-full max-w-2xl bg-surface-main/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-primary to-primary-container px-8 py-10 text-center text-white">

          <div className="w-20 h-20 mx-auto rounded-full bg-surface-main/20 flex items-center justify-center text-3xl font-bold shadow-lg">
            R
          </div>

          <h1 className="text-3xl font-bold mt-5">
            สมัครสมาชิก
          </h1>

          <p className="text-inverse-primary mt-2 text-sm">
            สำหรับนักศึกษาที่จบการศึกษา
          </p>
        </div>

        {/* FORM */}
        <div className="p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* STUDENT ID */}
            <div>
              <label htmlFor="register-student-id" className="block text-sm font-medium text-on-surface-variant mb-2">
                รหัสนักศึกษา <span className="text-error font-bold">*</span>
              </label>

              <input
                id="register-student-id"
                value={form.studentId}
                onChange={set('studentId')}
                required
                placeholder="6500000000"
                className="w-full px-4 py-3 rounded-xl border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
              />
            </div>

            {/* FULL NAME */}
            <div>
              <label htmlFor="register-full-name" className="block text-sm font-medium text-on-surface-variant mb-2">
                ชื่อ–นามสกุล <span className="text-error font-bold">*</span>
              </label>

              <input
                id="register-full-name"
                value={form.fullName}
                onChange={set('fullName')}
                required
                placeholder="ชื่อ นามสกุล"
                className="w-full px-4 py-3 rounded-xl border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
              />
            </div>

            {/* MAJOR */}
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                สาขาวิชา <span className="text-error font-bold">*</span>
              </label>

              <SearchableSelect
                options={MAJOR_OPTIONS}
                value={form.major}
                onChange={(val) => setForm({ ...form, major: val })}
                placeholder="-- ค้นหาและเลือกสาขาวิชา --"
                searchPlaceholder="พิมพ์ค้นหาสาขาวิชา..."
              />
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-on-surface-variant mb-2">
                อีเมล <span className="text-error font-bold">*</span>
              </label>

              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-on-surface-variant mb-2">
                รหัสผ่าน <span className="text-error font-bold">*</span>
              </label>

              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full px-4 py-3 rounded-xl border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-on-surface-variant mb-2">
                ยืนยันรหัสผ่าน <span className="text-error font-bold">*</span>
              </label>

              <input
                id="register-confirm-password"
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                required
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                className="w-full px-4 py-3 rounded-xl border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-error-container border border-error/30 text-error text-sm px-4 py-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-container hover:opacity-90 text-white font-bold text-base shadow-lg shadow-primary-container/30 hover:shadow-xl hover:shadow-primary-container/40 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-primary-fixed/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5 text-white shrink-0" />
              <span>สมัครสมาชิก</span>
            </button>
          </form>


          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            มีบัญชีแล้ว?
            <Link
              to="/login"
              className="ml-2 font-semibold text-primary-container hover:text-primary-container transition"
            >
              เข้าสู่ระบบ
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
