import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [resetId, setResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

  const load = () =>
    api
      .get('/api/admin/users')
      .catch(() => api.get('/api/users'))
      .then((res) => {
        setUsers(res.data?.users || res.data || []);
        setSelectedIds(new Set());
      });

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = users.filter((user) => roleFilter === 'all' || user.role === roleFilter);

  // ---------- Selection helpers ----------
  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.has(u._id));
  const isIndeterminate = filteredUsers.some((u) => selectedIds.has(u._id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredUsers.forEach((u) => next.delete(u._id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredUsers.forEach((u) => next.add(u._id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(
      `คุณต้องการลบผู้ใช้งานที่เลือกจำนวน ${selectedIds.size} รายการใช่หรือไม่?`
    );
    if (!confirmed) return;

    setIsBulkDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        await api.delete(`/api/users/${id}`);
        successCount++;
      } catch {
        failCount++;
      }
    }

    setIsBulkDeleting(false);
    load();

    if (failCount === 0) {
      alert(`ลบผู้ใช้งานสำเร็จ ${successCount} รายการ`);
    } else {
      alert(`ลบสำเร็จ ${successCount} รายการ, ล้มเหลว ${failCount} รายการ`);
    }
  };

  const suspend = (id) => api.patch(`/api/admin/users/${id}/suspend`).then(load);
  const activate = (id) => api.patch(`/api/admin/users/${id}/activate`).then(load);
  const setRole = (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }).then(load);

  const resetPassword = async () => {
    if (!resetId || !newPassword) {
      alert('กรุณากรอก User ID หรือรหัสนักศึกษา และรหัสผ่านใหม่');
      return;
    }
    if (newPassword.length < 6) {
      alert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    try {
      const res = await api.post(`/api/admin/users/${resetId}/reset-password`, { newPassword });
      setNewPassword('');
      setResetId('');
      alert(res.data?.message || 'รีเซ็ตรหัสผ่านสำเร็จ');
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
      await api.post('/api/users', addForm);
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
          <h1 className="text-2xl font-bold text-on-background">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-text-secondary">เพิ่ม แก้ไข ระงับการใช้งาน หรือจัดการสิทธิ์ของผู้ใช้ในระบบ</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddError('');
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:opacity-90 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-primary-fixed/30 transition duration-200 cursor-pointer"
        >
          + เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      {/* Quick Password Reset Box */}
      <div className="p-5 bg-surface-muted border border-border-subtle rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-on-background">รีเซ็ตรหัสผ่านแบบด่วน</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            placeholder="รหัสนักศึกษา"
            value={resetId}
            onChange={(e) => setResetId(e.target.value.trim())}
            className="px-3.5 py-2 border border-border-strong rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed w-72 bg-surface-main"
          />
          <input
            placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-3.5 py-2 border border-border-strong rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed bg-surface-main"
          />
          <button
            type="button"
            onClick={resetPassword}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 active:bg-black text-white text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 transition cursor-pointer"
          >
            รีเซ็ตรหัสผ่าน
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-on-background">รายชื่อผู้ใช้งาน</h2>
          <p className="text-sm text-text-secondary">แสดง {filteredUsers.length} จาก {users.length} รายการ</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={bulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-error hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold rounded-xl shadow-md shadow-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isBulkDeleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  กำลังลบ...
                </>
              ) : (
                <>🗑️ ลบที่เลือก ({selectedIds.size})</>
              )}
            </button>
          )}
          <label className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
            กรองตาม Role
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setSelectedIds(new Set()); }}
              className="px-3 py-2 border border-border-strong rounded-xl text-sm bg-surface-main focus:outline-none focus:ring-2 focus:ring-primary-fixed font-semibold"
            >
              <option value="all">ทุก Role</option>
              <option value="graduate">จบการศึกษา</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto border border-border-subtle rounded-2xl bg-surface-main shadow-sm">
        <table className="table w-full text-left">
          <thead className="bg-surface-muted border-b border-border-subtle text-xs font-bold text-on-surface-variant uppercase">
            <tr>
              <th className="px-4 py-3.5 w-10">
                <input
                  type="checkbox"
                  aria-label="เลือกทั้งหมด"
                  checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-400 accent-primary-container cursor-pointer"
                />
              </th>
              <th className="px-4 py-3.5">รหัส</th>
              <th className="px-4 py-3.5">ชื่อ-นามสกุล</th>
              <th className="px-4 py-3.5">อีเมล</th>
              <th className="px-4 py-3.5">สาขาวิชา</th>
              <th className="px-4 py-3.5">บทบาท</th>
              <th className="px-4 py-3.5">สถานะ</th>
              <th className="px-4 py-3.5 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-sm">
            {filteredUsers.map((u) => (
              <tr key={u._id} className={`hover:bg-surface-accent/70 transition-colors ${selectedIds.has(u._id) ? 'bg-insight-tint/60' : ''}`}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`เลือก ${u.fullName}`}
                    checked={selectedIds.has(u._id)}
                    onChange={() => toggleSelectOne(u._id)}
                    className="w-4 h-4 rounded border-slate-400 accent-primary-container cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 font-mono font-medium text-on-surface-variant">{u.studentId || '-'}</td>
                <td className="px-4 py-3 font-bold text-on-background">{u.fullName}</td>
                <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                <td className="px-4 py-3 text-on-surface-variant">{u.major || '-'}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => setRole(u._id, e.target.value)}
                    className="px-2.5 py-1 border border-border-strong rounded-lg text-xs font-semibold focus:ring-2 focus:ring-primary-fixed bg-surface-main"
                  >
                    <option value="graduate">จบการศึกษา</option>
                    <option value="admin">ผู้ดูแลระบบ</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {u.isActive === false ? (
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-red-800 bg-red-100 border border-red-200 rounded-full">
                      ระงับ
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-full">
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
                        className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                      >
                        เปิดใช้
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => suspend(u._id)}
                        className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-600 hover:text-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition cursor-pointer"
                      >
                        ระงับ
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteUser(u._id)}
                      className="px-3 py-1.5 text-xs font-bold text-red-800 bg-error-container hover:bg-error hover:text-white border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-sm text-text-secondary">
                  ไม่พบผู้ใช้งานใน Role ที่เลือก
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-main rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50">
              <h2 className="text-lg font-bold text-on-background">เพิ่มผู้ใช้งานใหม่</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-on-background hover:bg-surface-accent focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {addError && (
                <div className="p-3 bg-error-container border border-red-100 text-error text-xs rounded-lg">
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    รหัสนักศึกษา <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 64010001"
                    value={addForm.studentId}
                    onChange={(e) => setAddForm({ ...addForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="สมชาย ใจดี"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    รหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    สาขาวิชา
                  </label>
                  <select
                    value={addForm.major}
                    onChange={(e) => setAddForm({ ...addForm, major: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none bg-surface-main"
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
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    placeholder="0812345678"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">
                  บทบาท (Role)
                </label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none bg-surface-main"
                >
                  <option value="graduate">graduate (นักศึกษา/บัณฑิต)</option>
                  <option value="admin">admin (ผู้ดูแลระบบ)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm font-bold text-on-surface-variant bg-surface-accent hover:bg-slate-200 border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm text-white bg-primary-container hover:opacity-90 active:bg-blue-800 font-bold rounded-xl shadow-md shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-primary-fixed/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
