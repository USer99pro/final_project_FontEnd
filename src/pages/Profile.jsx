import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import SearchableSelect from '../components/SearchableSelect';
import { User, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState(false);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setMsg(''); // clear message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form };
    if (!body.password) delete body.password;
    try {
      await api.patch(`/api/users/${user._id}`, body);
      setError(false);
      setMsg('บันทึกโปรไฟล์สำเร็จ');
    } catch (err) {
      setError(true);
      setMsg(err.response?.data?.error || 'บันทึกไม่สำเร็จ');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Title */}
        <div className="px-8 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
        </div>

        <div className="p-8">
          {/* Avatar Section */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition"
                title="เปลี่ยนรูปโปรไฟล์"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ชื่อ–นามสกุล
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={set('fullName')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50/50"
                  placeholder="ชื่อ นามสกุล"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  รหัสนักศึกษา
                </label>
                <input
                  type="text"
                  value={form.studentId}
                  onChange={set('studentId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50/50"
                  placeholder="รหัสนักศึกษา"
                />
              </div>

              {/* Major */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  สาขาวิชา
                </label>
                <SearchableSelect
                  options={MAJOR_OPTIONS}
                  value={form.major}
                  onChange={(val) => {
                    setForm({ ...form, major: val });
                    setMsg('');
                  }}
                  placeholder="-- ค้นหาและเลือกสาขาวิชา --"
                  searchPlaceholder="พิมพ์ค้นหาสาขาวิชา..."
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  เบอร์โทร
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={set('phone')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50/50"
                  placeholder="08X-XXX-XXXX"
                />
              </div>
            </div>

            {/* Password */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
              </label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50/50"
                placeholder="********"
              />
            </div>

            {/* Status Message */}
            {msg && (
              <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                {error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                {msg}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Save
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
