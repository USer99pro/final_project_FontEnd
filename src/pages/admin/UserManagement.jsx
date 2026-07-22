import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [resetId, setResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Add User State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    studentId: '',
    fullName: '',
    email: '',
    password: '',
    major: '',
    phone: '',
    role: 'graduate',
  });
  const [addError, setAddError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => api.get('/api/users').then((res) => setUsers(res.data));

  useEffect(() => {
    load();
  }, []);

  const suspend = (id) => api.patch(`/api/admin/users/${id}/suspend`).then(load);
  const activate = (id) => api.patch(`/api/admin/users/${id}/activate`).then(load);
  const setRole = (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }).then(load);

  const resetPassword = async () => {
    if (!resetId || !newPassword) return;
    try {
      await api.post(`/api/admin/users/${resetId}/reset-password`, { newPassword });
      setNewPassword('');
      setResetId('');
      alert('รีเซ็ตรหัสผ่านสำเร็จ');
    } catch (err) {
      alert(err.response?.data?.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/users/${id}`);
      load();
      alert('ลบผู้ใช้งานสำเร็จ');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'ไม่สามารถลบผู้ใช้งานได้');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!addForm.studentId || !addForm.fullName || !addForm.email || !addForm.password) {
      setAddError('กรุณากรอกรหัสนักศึกษา, ชื่อ-นามสกุล, อีเมล และรหัสผ่านให้ครบถ้วน');
      return;
    }
    if (addForm.password.length < 6) {
      setAddError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/admin/users', addForm);
      setShowAddModal(false);
      setAddForm({
        studentId: '',
        fullName: '',
        email: '',
        password: '',
        major: '',
        phone: '',
        role: 'graduate',
      });
      load();
      alert('เพิ่มผู้ใช้งานสำเร็จ');
    } catch (err) {
      setAddError(err.response?.data?.error || 'ไม่สามารถเพิ่มผู้ใช้งานได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-gray-500">เพิ่ม แก้ไข ระงับการใช้งาน หรือจัดการสิทธิ์ของผู้ใช้ในระบบ</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddError('');
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          + เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      {/* Quick Password Reset Box */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">รีเซ็ตรหัสผ่านแบบด่วน</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            placeholder="User ID (Mongo ID)"
            value={resetId}
            onChange={(e) => setResetId(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={resetPassword}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition"
          >
            รีเซ็ตรหัสผ่าน
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
        <table className="table w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">รหัส</th>
              <th className="px-4 py-3">ชื่อ-นามสกุล</th>
              <th className="px-4 py-3">อีเมล</th>
              <th className="px-4 py-3">สาขาวิชา</th>
              <th className="px-4 py-3">บทบาท (Role)</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-mono text-gray-700">{u.studentId || '-'}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{u.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.major || '-'}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => setRole(u._id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="graduate">graduate</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {u.isActive === false ? (
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                      ระงับ
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      ใช้งาน
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.isActive === false ? (
                      <button
                        type="button"
                        onClick={() => activate(u._id)}
                        className="px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded transition"
                      >
                        เปิดใช้
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => suspend(u._id)}
                        className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition"
                      >
                        ระงับ
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteUser(u._id)}
                      className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition"
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">เพิ่มผู้ใช้งานใหม่</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    รหัสนักศึกษา <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 64010001"
                    value={addForm.studentId}
                    onChange={(e) => setAddForm({ ...addForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="สมชาย ใจดี"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    รหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    สาขาวิชา
                  </label>
                  <select
                    value={addForm.major}
                    onChange={(e) => setAddForm({ ...addForm, major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    placeholder="0812345678"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  บทบาท (Role)
                </label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="graduate">graduate (นักศึกษา/บัณฑิต)</option>
                  <option value="admin">admin (ผู้ดูแลระบบ)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มผู้ใช้งาน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
