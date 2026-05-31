import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/graduate');
    } catch (err) {
      setError(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-100 via-white to-indigo-100">
  
      {/* CARD */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-white/40">
  
        {/* TOP SECTION */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center text-white">
  
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold shadow-lg">
            R
          </div>
  
          <h1 className="text-3xl font-bold mt-5">
            เข้าสู่ระบบ
          </h1>
  
          <p className="text-blue-100 mt-2 text-sm">
            สำหรับนักศึกษาที่จบการศึกษาและผู้ดูแลระบบ
          </p>
        </div>
  
        {/* FORM */}
        <div className="p-8">
  
          <form onSubmit={handleSubmit} className="space-y-5">
  
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
  
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
  
            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
  
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              className="w-full py-3 rounded-xl from-blue-600 to-indigo-600  font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition duration-300"
            >
              เข้าสู่ระบบ
            </button>
  
          </form>
  
          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-gray-600">
            ยังไม่มีบัญชี?
            <Link
              to="/register"
              className="ml-2 font-semibold text-blue-600 hover:text-indigo-600 transition"
            >
              สมัครสมาชิก
            </Link>
          </div>
  
        </div>
      </div>
    </div>
  );

}
