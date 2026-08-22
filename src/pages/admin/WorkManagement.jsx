import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Download, Loader2 } from 'lucide-react';

export default function WorkManagement() {
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);
  const [exporting, setExporting] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Participant Management Modal State
  const [editingWork, setEditingWork] = useState(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleExportCsv = useCallback(async () => {
    setExporting(true);
    try {
      const res = await api.get('/api/admin/reports/export.csv', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `works-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.error || 'ไม่สามารถส่งออกข้อมูลได้');
    } finally {
      setExporting(false);
    }
  }, []);

  const loadData = async () => {
    try {
      const [worksRes, usersRes] = await Promise.all([
        api.get('/api/admin/works'),
        api.get('/api/admin/users').catch(() => api.get('/api/users')),
      ]);
      setWorks(worksRes.data.works || worksRes.data || []);
      setUsers(usersRes.data.users || usersRes.data || []);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const remove = async (id) => {
    if (!confirm('ต้องการลบผลงานนี้ใช่หรือไม่?')) return;
    try {
      await api.delete(`/api/admin/works/${id}`).catch(() => api.delete(`/api/contents/${id}`));
      setWorks((prev) => prev.filter((w) => w._id !== id));
      alert('ลบผลงานเรียบร้อยแล้ว');
    } catch (err) {
      alert(err.response?.data?.error || 'ไม่สามารถลบผลงานได้');
    }
  };

  // ---------- Selection helpers ----------
  const isAllSelected = works.length > 0 && works.every((w) => selectedIds.has(w._id));
  const isIndeterminate = works.some((w) => selectedIds.has(w._id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(works.map((w) => w._id)));
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

  const bulkRemove = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(
      `คุณต้องการลบผลงานที่เลือกจำนวน ${selectedIds.size} รายการใช่หรือไม่?`
    );
    if (!confirmed) return;

    setIsBulkDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedIds) {
      try {
        await api.delete(`/api/admin/works/${id}`).catch(() => api.delete(`/api/contents/${id}`));
        successCount++;
      } catch {
        failCount++;
      }
    }

    setIsBulkDeleting(false);
    loadData();

    if (failCount === 0) {
      alert(`ลบผลงานสำเร็จ ${successCount} รายการ`);
    } else {
      alert(`ลบสำเร็จ ${successCount} รายการ, ล้มเหลว ${failCount} รายการ`);
    }
  };

  const openParticipantModal = async (work) => {
    setEditingWork({
      ...work,
      participants: (work.participants || []).map((p) => (typeof p === 'string' ? p : p._id)),
    });
    setSelectedParticipantId('');

    if (work.major) {
      try {
        const res = await api
          .get('/api/admin/users', { params: { major: work.major, isActive: 'true' } })
          .catch(() => api.get('/api/users', { params: { major: work.major } }));
        setUsers(res.data.users || res.data || []);
      } catch {
        /* keep existing users list */
      }
    }
  };

  const addParticipantToWork = () => {
    if (!selectedParticipantId || !editingWork) return;
    if (editingWork.participants.includes(selectedParticipantId)) {
      setSelectedParticipantId('');
      return;
    }
    setEditingWork({
      ...editingWork,
      participants: [...editingWork.participants, selectedParticipantId],
    });
    setSelectedParticipantId('');
  };

  const removeParticipantFromWork = (pId) => {
    if (!editingWork) return;
    setEditingWork({
      ...editingWork,
      participants: editingWork.participants.filter((id) => id !== pId),
    });
  };

  const saveParticipants = async () => {
    if (!editingWork) return;
    setIsSaving(true);
    try {
      const body = new FormData();
      editingWork.participants.forEach((pId) => body.append('participants', pId));

      await api.patch(`/api/admin/works/${editingWork._id}`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).catch(() =>
        api.patch(`/api/contents/${editingWork._id}`, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );

      alert('อัปเดตผู้ร่วมจัดทำโครงการสำเร็จ');
      setEditingWork(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'ไม่สามารถบันทึกผู้ร่วมจัดทำได้');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-background">จัดการผลงานวิจัยและโครงการทั้งหมด</h1>
          <p className="text-sm text-text-secondary">จัดการผลงาน เพิ่มโครงการใหม่ และบริหารผู้ร่วมจัดทำโครงการ (Project Participants)</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={bulkRemove}
              disabled={isBulkDeleting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-error hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 disabled:bg-emerald-50 text-emerald-800 font-bold text-sm rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin text-emerald-700" /> : <Download className="w-4 h-4 text-emerald-700" />}
            <span>{exporting ? 'กำลังส่งออก...' : 'ส่งออก CSV'}</span>
          </button>
          <Link
            to="/graduate/works/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:bg-[#1E40AF] active:bg-[#1E3A8A] !text-white font-black text-sm rounded-xl border-2 border-blue-300 shadow-[0_4px_14px_rgba(30,64,175,0.45)] focus:outline-none focus:ring-4 focus:ring-blue-400/40 transition-all duration-200 cursor-pointer opacity-100"
          >
            <span>+ เพิ่มผลงาน/โครงการใหม่</span>
          </Link>
        </div>
      </div>

      {/* Works Table */}
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
              <th className="px-4 py-3.5">ชื่อผลงาน / โครงการ</th>
              <th className="px-4 py-3.5">ผู้จัดทำหลัก</th>
              <th className="px-4 py-3.5">ผู้ร่วมจัดทำ (Participants)</th>
              <th className="px-4 py-3.5">สาขา / ปี</th>
              <th className="px-4 py-3.5">สถานะ</th>
              <th className="px-4 py-3.5 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-sm">
            {works.map((w) => {
              const participantList = (w.participants || []).map((p) =>
                typeof p === 'object' ? p.fullName : users.find((u) => u._id === p)?.fullName || p
              );

              return (
                <tr key={w._id} className={`hover:bg-surface-accent/70 transition-colors ${selectedIds.has(w._id) ? 'bg-insight-tint/60' : ''}`}>
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      aria-label={`เลือก ${w.title}`}
                      checked={selectedIds.has(w._id)}
                      onChange={() => toggleSelectOne(w._id)}
                      className="w-4 h-4 rounded border-slate-400 accent-primary-container cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3.5 font-bold text-on-background max-w-xs truncate">
                    {w.title}
                  </td>
                  <td className="px-4 py-3.5 text-on-background font-medium">{w.studentName || w.author?.fullName || '-'}</td>
                  <td className="px-4 py-3.5">
                    {participantList.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {participantList.map((name, idx) => (
                          <span key={idx} className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-insight-tint text-primary-container rounded-full border border-primary-fixed">
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-outline text-xs">— ไม่มี —</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-on-surface-variant font-medium">
                    {w.major || '-'} {w.academicYear ? `(${w.academicYear})` : ''}
                  </td>
                  <td className="px-4 py-3.5">
                    {w.status === 'published' ? (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-full">
                        เผยแพร่
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 rounded-full">
                        แบบร่าง
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openParticipantModal(w)}
                        className="px-3 py-1.5 text-xs font-bold text-primary-container bg-insight-tint hover:bg-primary-container hover:text-white border border-primary-fixed/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed transition cursor-pointer"
                      >
                        จัดการผู้ร่วมงาน
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/graduate/works/${w._id}/edit`)}
                        className="px-3 py-1.5 text-xs font-bold text-on-background bg-surface-accent hover:bg-slate-200 border border-border-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(w._id)}
                        className="px-3 py-1.5 text-xs font-bold text-red-800 bg-error-container hover:bg-error hover:text-white border border-error/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Participant Management Modal */}
      {editingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-main rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/50">
              <div>
                <h2 className="text-lg font-bold text-on-background">จัดการผู้ร่วมจัดทำโครงการ</h2>
                <p className="text-xs text-text-secondary truncate max-w-xs">{editingWork.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingWork(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-on-background hover:bg-surface-accent focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  เลือกผู้ใช้งานเพื่อเพิ่มเป็นผู้ร่วมจัดทำ (แผนก {editingWork.major})
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedParticipantId}
                    onChange={(e) => setSelectedParticipantId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-primary-fixed outline-none bg-surface-main"
                  >
                    <option value="">— เลือกผู้ใช้งาน —</option>
                    {users
                      .filter((u) => u.major === editingWork.major && !editingWork.participants.includes(u._id))
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.fullName} {u.studentId ? `(${u.studentId})` : ''} — {u.email}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={addParticipantToWork}
                    className="px-4 py-2 bg-primary-container hover:opacity-90 text-white text-sm font-medium rounded-lg shadow-sm transition"
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-on-surface-variant mb-2">รายชื่อผู้ร่วมจัดทำโครงการในปัจจุบัน:</h4>
                {editingWork.participants.length > 0 ? (
                  <div className="space-y-2">
                    {editingWork.participants.map((pId) => {
                      const userObj = users.find((u) => u._id === pId);
                      return (
                        <div
                          key={pId}
                          className="flex items-center justify-between p-2.5 bg-surface-muted rounded-lg border border-border-subtle text-sm"
                        >
                          <div>
                            <span className="font-medium text-on-background">
                              {userObj ? userObj.fullName : pId}
                            </span>
                            {userObj?.studentId && (
                              <span className="text-xs text-text-secondary ml-2">({userObj.studentId})</span>
                            )}
                            {userObj?.email && (
                              <span className="text-xs text-outline block">{userObj.email}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeParticipantFromWork(pId)}
                            className="text-xs font-bold text-error px-2.5 py-1.5 bg-error-container hover:bg-error hover:text-white border border-error/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
                          >
                            นำออก
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-outline italic">ยังไม่มีผู้ร่วมจัดทำในโครงการนี้</p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setEditingWork(null)}
                  className="px-4 py-2.5 text-sm font-bold text-on-surface-variant bg-surface-accent hover:bg-slate-200 border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={saveParticipants}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm text-white bg-primary-container hover:opacity-90 active:bg-blue-800 font-bold rounded-xl shadow-md shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-primary-fixed/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
