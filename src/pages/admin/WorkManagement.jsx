import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { Download, Loader2 } from 'lucide-react';

export default function WorkManagement() {
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);
  const [exporting, setExporting] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900">จัดการผลงานวิจัยและโครงการทั้งหมด</h1>
          <p className="text-sm text-gray-500">จัดการผลงาน เพิ่มโครงการใหม่ และบริหารผู้ร่วมจัดทำโครงการ (Project Participants)</p>
        </div>
        <div className="flex items-center gap-3">
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
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] !text-white font-black text-sm rounded-xl border-2 border-blue-300 shadow-[0_4px_14px_rgba(30,64,175,0.45)] focus:outline-none focus:ring-4 focus:ring-blue-400/40 transition-all duration-200 cursor-pointer opacity-100"
          >
            <span>+ เพิ่มผลงาน/โครงการใหม่</span>
          </Link>
        </div>
      </div>

      {/* Works Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="table w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
            <tr>
              <th className="px-4 py-3.5">ชื่อผลงาน / โครงการ</th>
              <th className="px-4 py-3.5">ผู้จัดทำหลัก</th>
              <th className="px-4 py-3.5">ผู้ร่วมจัดทำ (Participants)</th>
              <th className="px-4 py-3.5">สาขา / ปี</th>
              <th className="px-4 py-3.5">สถานะ</th>
              <th className="px-4 py-3.5 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {works.map((w) => {
              const participantList = (w.participants || []).map((p) =>
                typeof p === 'object' ? p.fullName : users.find((u) => u._id === p)?.fullName || p
              );

              return (
                <tr key={w._id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                    {w.title}
                  </td>
                  <td className="px-4 py-3.5 text-slate-800 font-medium">{w.studentName || w.author?.fullName || '-'}</td>
                  <td className="px-4 py-3.5">
                    {participantList.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {participantList.map((name, idx) => (
                          <span key={idx} className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">— ไม่มี —</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">
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
                        className="px-3 py-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                      >
                        จัดการผู้ร่วมงาน
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/graduate/works/${w._id}/edit`)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(w._id)}
                        className="px-3 py-1.5 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">จัดการผู้ร่วมจัดทำโครงการ</h2>
                <p className="text-xs text-gray-500 truncate max-w-xs">{editingWork.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingWork(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เลือกผู้ใช้งานเพื่อเพิ่มเป็นผู้ร่วมจัดทำ (แผนก {editingWork.major})
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedParticipantId}
                    onChange={(e) => setSelectedParticipantId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">รายชื่อผู้ร่วมจัดทำโครงการในปัจจุบัน:</h4>
                {editingWork.participants.length > 0 ? (
                  <div className="space-y-2">
                    {editingWork.participants.map((pId) => {
                      const userObj = users.find((u) => u._id === pId);
                      return (
                        <div
                          key={pId}
                          className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                        >
                          <div>
                            <span className="font-medium text-gray-900">
                              {userObj ? userObj.fullName : pId}
                            </span>
                            {userObj?.studentId && (
                              <span className="text-xs text-gray-500 ml-2">({userObj.studentId})</span>
                            )}
                            {userObj?.email && (
                              <span className="text-xs text-gray-400 block">{userObj.email}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeParticipantFromWork(pId)}
                            className="text-xs font-bold text-red-700 px-2.5 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition cursor-pointer"
                          >
                            นำออก
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">ยังไม่มีผู้ร่วมจัดทำในโครงการนี้</p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingWork(null)}
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={saveParticipants}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-bold rounded-xl shadow-md shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
