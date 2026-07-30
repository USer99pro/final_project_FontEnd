import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function WorkManagement() {
  const navigate = useNavigate();
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);

  // Participant Management Modal State
  const [editingWork, setEditingWork] = useState(null);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const openParticipantModal = (work) => {
    setEditingWork({
      ...work,
      participants: (work.participants || []).map((p) => (typeof p === 'string' ? p : p._id)),
    });
    setSelectedParticipantId('');
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
        <Link
          to="/graduate/works/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          + เพิ่มผลงาน/โครงการใหม่
        </Link>
      </div>

      {/* Works Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
        <table className="table w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">ชื่อผลงาน / โครงการ</th>
              <th className="px-4 py-3">ผู้จัดทำหลัก</th>
              <th className="px-4 py-3">ผู้ร่วมจัดทำ (Participants)</th>
              <th className="px-4 py-3">สาขา / ปี</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {works.map((w) => {
              const participantList = (w.participants || []).map((p) =>
                typeof p === 'object' ? p.fullName : users.find((u) => u._id === p)?.fullName || p
              );

              return (
                <tr key={w._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                    {w.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{w.studentName || w.author?.fullName || '-'}</td>
                  <td className="px-4 py-3">
                    {participantList.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {participantList.map((name, idx) => (
                          <span key={idx} className="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">— ไม่มี —</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {w.major || '-'} {w.academicYear ? `(${w.academicYear})` : ''}
                  </td>
                  <td className="px-4 py-3">
                    {w.status === 'published' ? (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        เผยแพร่
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
                        แบบร่าง
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openParticipantModal(w)}
                        className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition"
                      >
                        จัดการผู้ร่วมงาน
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/graduate/works/${w._id}/edit`)}
                        className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(w._id)}
                        className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition"
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
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เลือกผู้ใช้งานเพื่อเพิ่มเป็นผู้ร่วมจัดทำ (Participants)
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedParticipantId}
                    onChange={(e) => setSelectedParticipantId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">— เลือกผู้ใช้งาน —</option>
                    {users
                      .filter((u) => !editingWork.participants.includes(u._id))
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
                            className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition"
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
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={saveParticipants}
                  disabled={isSaving}
                  className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg shadow-sm transition disabled:opacity-50"
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
