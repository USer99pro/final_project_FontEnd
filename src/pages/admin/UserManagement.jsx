import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../../api/client';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Parse an uploaded file → array of row objects */
async function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/** Guess which source column maps to each required field */
function autoDetect(headers) {
  const lower = (s) => s.toLowerCase().replace(/\s|_|-/g, '');
  const pick = (keywords) =>
    headers.find((h) => keywords.some((k) => lower(h).includes(k))) || '';

  return {
    studentId: pick(['studentid', 'รหัสนักศึกษา', 'student', 'id', 'รหัส']),
    fullName: pick(['fullname', 'ชื่อ', 'name', 'นามสกุล']),
    email: pick(['email', 'อีเมล', 'mail']),
    password: pick(['password', 'รหัสผ่าน', 'pass']),
    major: pick(['major', 'สาขา', 'faculty', 'department']),
    phone: pick(['phone', 'โทร', 'mobile', 'tel']),
    role: pick(['role', 'บทบาท', 'สิทธิ์']),
  };
}

const REQUIRED_FIELDS = ['studentId', 'fullName', 'email', 'password'];

const FIELD_LABELS = {
  studentId: 'รหัสนักศึกษา *',
  fullName: 'ชื่อ-นามสกุล *',
  email: 'อีเมล *',
  password: 'รหัสผ่าน *',
  major: 'สาขาวิชา',
  phone: 'เบอร์โทรศัพท์',
  role: 'บทบาท (role)',
};

// ── component ─────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [resetId, setResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Add single user
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

  // Import CSV/Excel state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importRows, setImportRows] = useState([]);      // raw parsed rows
  const [importHeaders, setImportHeaders] = useState([]); // column names from file
  const [colMap, setColMap] = useState({});              // field → header mapping
  const [importErrors, setImportErrors] = useState([]);
  const [importProgress, setImportProgress] = useState(null); // { done, total, success, fail }
  const [importDone, setImportDone] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const fileInputRef = useRef(null);

  // ── data loading ────────────────────────────────────────────────────────────

  const load = () =>
    api
      .get('/api/admin/users')
      .catch(() => api.get('/api/users'))
      .then((res) => {
        setUsers(res.data?.users || res.data || []);
        setSelectedIds(new Set());
      });

  useEffect(() => { load(); }, []);

  const filteredUsers = users.filter(
    (user) => roleFilter === 'all' || user.role === roleFilter
  );

  // ── selection ────────────────────────────────────────────────────────────────

  const isAllSelected =
    filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.has(u._id));
  const isIndeterminate =
    filteredUsers.some((u) => selectedIds.has(u._id)) && !isAllSelected;

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

  // ── bulk delete ──────────────────────────────────────────────────────────────

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(
      `คุณต้องการลบผู้ใช้งานที่เลือกจำนวน ${selectedIds.size} รายการใช่หรือไม่?`
    );
    if (!confirmed) return;

    setIsBulkDeleting(true);
    let successCount = 0, failCount = 0;
    for (const id of selectedIds) {
      try { await api.delete(`/api/users/${id}`); successCount++; }
      catch { failCount++; }
    }
    setIsBulkDeleting(false);
    load();
    if (failCount === 0) alert(`ลบผู้ใช้งานสำเร็จ ${successCount} รายการ`);
    else alert(`ลบสำเร็จ ${successCount} รายการ, ล้มเหลว ${failCount} รายการ`);
  };

  // ── single actions ───────────────────────────────────────────────────────────

  const suspend = (id) => api.patch(`/api/admin/users/${id}/suspend`).then(load);
  const activate = (id) => api.patch(`/api/admin/users/${id}/activate`).then(load);
  const setRole = (id, role) =>
    api.patch(`/api/admin/users/${id}/role`, { role }).then(load);

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
      const res = await api.post(
        `/api/admin/users/${resetId}/reset-password`,
        { newPassword }
      );
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
      alert(error.response?.data?.error || 'ไม่สามารถลบผู้ใช้งานได้');
    }
  };

  // ── add single user ──────────────────────────────────────────────────────────

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!addForm.studentId || !addForm.fullName || !addForm.password) {
      setAddError('กรุณากรอกรหัสนักศึกษา, ชื่อ-นามสกุล และรหัสผ่านให้ครบถ้วน');
      return;
    }
    if (addForm.email && addForm.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(addForm.email.trim())) {
        setAddError('รูปแบบอีเมลไม่ถูกต้อง');
        return;
      }
    }
    if (addForm.password.length < 6) {
      setAddError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...addForm,
        studentId: addForm.studentId.trim(),
        fullName: addForm.fullName.trim(),
        email: addForm.email && addForm.email.trim() ? addForm.email.trim() : undefined,
      };
      await api.post('/api/users', payload);
      setShowAddModal(false);
      setAddForm({ studentId: '', fullName: '', email: '', password: '', major: '', phone: '', role: 'graduate' });
      load();
      alert('เพิ่มผู้ใช้งานสำเร็จ');
    } catch (err) {
      setAddError(err.response?.data?.error || 'ไม่สามารถเพิ่มผู้ใช้งานได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── import CSV / Excel ───────────────────────────────────────────────────────

  const openImportModal = () => {
    setImportRows([]);
    setImportHeaders([]);
    setColMap({});
    setImportErrors([]);
    setImportProgress(null);
    setImportDone(false);
    setImportFileName('');
    setShowImportModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportFileName(file.name);
    setImportErrors([]);
    setImportProgress(null);
    setImportDone(false);
    try {
      const rows = await parseFile(file);
      if (rows.length === 0) {
        setImportErrors(['ไฟล์ไม่มีข้อมูล หรือรูปแบบไม่ถูกต้อง']);
        return;
      }
      const headers = Object.keys(rows[0]);
      setImportHeaders(headers);
      setImportRows(rows);
      setColMap(autoDetect(headers));
    } catch {
      setImportErrors(['ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบไฟล์']);
    }
    // reset the input so user can re-select same file
    e.target.value = '';
  };

  /** Map raw row → user payload using colMap */
  const mapRow = (row) => ({
    studentId: String(row[colMap.studentId] ?? '').trim(),
    fullName: String(row[colMap.fullName] ?? '').trim(),
    email: String(row[colMap.email] ?? '').trim(),
    password: String(row[colMap.password] ?? '').trim(),
    major: String(row[colMap.major] ?? '').trim(),
    phone: String(row[colMap.phone] ?? '').trim(),
    role: String(row[colMap.role] ?? 'graduate').trim() || 'graduate',
  });

  /** Validate all rows before import */
  const validateRows = () => {
    const errs = [];
    // Check required mapping
    for (const f of REQUIRED_FIELDS) {
      if (!colMap[f]) errs.push(`ยังไม่ได้เลือกคอลัมน์สำหรับ "${FIELD_LABELS[f]}"`);
    }
    if (errs.length) return errs;

    importRows.forEach((row, i) => {
      const mapped = mapRow(row);
      if (!mapped.studentId) errs.push(`แถว ${i + 2}: ไม่มีรหัสนักศึกษา`);
      if (!mapped.fullName) errs.push(`แถว ${i + 2}: ไม่มีชื่อ-นามสกุล`);
      if (!mapped.email || !mapped.email.includes('@')) errs.push(`แถว ${i + 2}: อีเมลไม่ถูกต้อง`);
      if (!mapped.password || mapped.password.length < 6)
        errs.push(`แถว ${i + 2}: รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร`);
    });
    return errs;
  };

  const runImport = async () => {
    const errs = validateRows();
    if (errs.length) { setImportErrors(errs); return; }

    setImportErrors([]);
    const total = importRows.length;
    setImportProgress({ done: 0, total, success: 0, fail: 0 });

    let success = 0, fail = 0;
    const failDetails = [];

    for (let i = 0; i < importRows.length; i++) {
      const payload = mapRow(importRows[i]);
      try {
        await api.post('/api/users', payload);
        success++;
      } catch (err) {
        fail++;
        failDetails.push(
          `แถว ${i + 2} (${payload.studentId || payload.email}): ${
            err.response?.data?.error || err.message
          }`
        );
      }
      setImportProgress({ done: i + 1, total, success, fail });
    }

    setImportDone(true);
    if (failDetails.length) setImportErrors(failDetails);
    load();
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['studentId', 'fullName', 'email', 'password', 'major', 'phone', 'role'],
      ['64010001', 'สมชาย ใจดี', 'somchai@example.com', 'password123', 'สาขาวิชาเทคโนโลยีสารสนเทศ', '0812345678', 'graduate'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'user_import_template.xlsx');
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-background">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-text-secondary">
            เพิ่ม แก้ไข ระงับการใช้งาน หรือจัดการสิทธิ์ของผู้ใช้ในระบบ
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Import button */}
          <button
            type="button"
            onClick={openImportModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 8l-3-3m3 3l3-3" />
            </svg>
            นำเข้าข้อมูล CSV/Excel
          </button>
          {/* Add single user button */}
          <button
            type="button"
            onClick={() => { setAddError(''); setShowAddModal(true); }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:opacity-90 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-primary-fixed/30 transition duration-200 cursor-pointer"
          >
            + เพิ่มผู้ใช้งานใหม่
          </button>
        </div>
      </div>

      {/* ── Quick Password Reset ── */}
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

      {/* ── Users table header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-on-background">รายชื่อผู้ใช้งาน</h2>
          <p className="text-sm text-text-secondary">
            แสดง {filteredUsers.length} จาก {users.length} รายการ
          </p>
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

      {/* ── Users table ── */}
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
              <tr
                key={u._id}
                className={`hover:bg-surface-accent/70 transition-colors ${
                  selectedIds.has(u._id) ? 'bg-insight-tint/60' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`เลือก ${u.fullName}`}
                    checked={selectedIds.has(u._id)}
                    onChange={() => toggleSelectOne(u._id)}
                    className="w-4 h-4 rounded border-slate-400 accent-primary-container cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 font-mono font-medium text-on-surface-variant">
                  {u.studentId || '-'}
                </td>
                <td className="px-4 py-3 font-bold text-on-background">{u.fullName}</td>
                <td className="px-4 py-3 text-on-surface-variant">{u.email || '-'}</td>
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

      {/* ════════════════════ ADD USER MODAL ════════════════════ */}
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
                    type="text" required placeholder="เช่น 64010001"
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
                    type="text" required placeholder="สมชาย ใจดี"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">
                    อีเมล <span className="text-text-secondary font-normal">(ไม่จำเป็นต้องกรอก)</span>
                  </label>
                  <input
                    type="email" placeholder="user@example.com (ไม่บังคับ)"
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
                    type="password" required placeholder="อย่างน้อย 6 ตัวอักษร"
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">สาขาวิชา</label>
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
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text" placeholder="0812345678"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">บทบาท (Role)</label>
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

      {/* ════════════════════ IMPORT MODAL ════════════════════ */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-main rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-border-subtle flex flex-col">

            {/* Header */}
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-on-background">นำเข้าข้อมูลผู้ใช้งาน</h2>
                <p className="text-xs text-text-secondary">รองรับไฟล์ CSV, XLS, XLSX</p>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-on-background hover:bg-surface-accent transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">

              {/* Step 1 – Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-on-background">ขั้นตอนที่ 1 — อัปโหลดไฟล์</p>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    ดาวน์โหลด Template
                  </button>
                </div>

                {/* Drop zone */}
                <label
                  htmlFor="import-file-input"
                  className="flex flex-col items-center justify-center gap-3 w-full h-36 border-2 border-dashed border-border-strong rounded-2xl bg-surface-muted hover:bg-surface-accent/50 cursor-pointer transition group"
                >
                  <svg className="w-8 h-8 text-text-secondary group-hover:text-primary-container transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-on-surface-variant">
                      {importFileName || 'คลิกหรือลากไฟล์มาวางที่นี่'}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">CSV, XLS, XLSX — ไม่เกิน 10 MB</p>
                  </div>
                  <input
                    id="import-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Step 2 – Column Mapping */}
              {importRows.length > 0 && !importProgress && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-on-background">
                    ขั้นตอนที่ 2 — จับคู่คอลัมน์
                    <span className="ml-2 text-xs font-normal text-text-secondary">
                      (พบ {importRows.length} แถว)
                    </span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(FIELD_LABELS).map(([field, label]) => (
                      <div key={field} className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-on-surface-variant w-36 shrink-0">
                          {label}
                        </label>
                        <select
                          value={colMap[field] || ''}
                          onChange={(e) =>
                            setColMap((prev) => ({ ...prev, [field]: e.target.value }))
                          }
                          className="flex-1 px-2.5 py-1.5 border border-border-strong rounded-lg text-xs focus:ring-2 focus:ring-primary-fixed outline-none bg-surface-main"
                        >
                          <option value="">-- ไม่ใช้ --</option>
                          {importHeaders.map((h) => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Preview table */}
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-text-secondary mb-1.5">
                      ตัวอย่างข้อมูล (5 แถวแรก)
                    </p>
                    <div className="overflow-x-auto border border-border-subtle rounded-xl">
                      <table className="min-w-full text-xs">
                        <thead className="bg-surface-muted text-on-surface-variant">
                          <tr>
                            {importHeaders.map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                          {importRows.slice(0, 5).map((row, i) => (
                            <tr key={i} className="hover:bg-surface-accent/40">
                              {importHeaders.map((h) => (
                                <td key={h} className="px-3 py-1.5 whitespace-nowrap text-on-surface-variant">
                                  {String(row[h] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Progress */}
              {importProgress && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-on-background">
                    กำลังนำเข้าข้อมูล... {importProgress.done}/{importProgress.total}
                  </p>
                  <div className="w-full bg-surface-muted rounded-full h-3 overflow-hidden border border-border-subtle">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.done / importProgress.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <span className="text-emerald-700">✓ สำเร็จ: {importProgress.success}</span>
                    <span className="text-red-700">✗ ล้มเหลว: {importProgress.fail}</span>
                  </div>
                </div>
              )}

              {/* Done summary */}
              {importDone && (
                <div className={`p-4 rounded-xl border text-sm font-semibold ${
                  importProgress?.fail === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {importProgress?.fail === 0
                    ? `✅ นำเข้าข้อมูลสำเร็จทั้งหมด ${importProgress.success} รายการ`
                    : `⚠️ นำเข้าสำเร็จ ${importProgress.success} รายการ | ล้มเหลว ${importProgress.fail} รายการ`}
                </div>
              )}

              {/* Errors */}
              {importErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1 max-h-40 overflow-y-auto">
                  <p className="text-xs font-bold text-red-800 mb-1">
                    พบข้อผิดพลาด ({importErrors.length} รายการ)
                  </p>
                  {importErrors.map((e, i) => (
                    <p key={i} className="text-xs text-red-700">• {e}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border-subtle bg-surface-muted/50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2.5 text-sm font-bold text-on-surface-variant bg-surface-accent hover:bg-slate-200 border border-border-strong rounded-xl transition cursor-pointer"
              >
                ปิด
              </button>
              {importRows.length > 0 && !importDone && (
                <button
                  type="button"
                  onClick={runImport}
                  disabled={!!importProgress}
                  className="px-5 py-2.5 text-sm text-white bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {importProgress ? 'กำลังนำเข้า...' : `นำเข้าข้อมูล ${importRows.length} รายการ`}
                </button>
              )}
              {importDone && (
                <button
                  type="button"
                  onClick={openImportModal}
                  className="px-5 py-2.5 text-sm text-white bg-primary-container hover:opacity-90 font-bold rounded-xl transition cursor-pointer"
                >
                  นำเข้าใหม่
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
