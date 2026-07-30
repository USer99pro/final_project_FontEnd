import { useEffect, useState } from 'react';
import api from '../../api/client';

const emptyAdvisor = {
  prefix: '', fullName: '', email: '', phone: '', academicPosition: '', department: '', expertise: '', office: '', isActive: true,
};

export default function AdvisorManagement() {
  const [advisors, setAdvisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyAdvisor);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [advisorRes, departmentRes] = await Promise.all([
        api.get('/api/advisors', { params: { isActive: 'all', limit: 200 } }),
        api.get('/api/departments'),
      ]);
      setAdvisors(advisorRes.data.advisors || []);
      setDepartments(departmentRes.data.departments || departmentRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถโหลดรายชื่อครูที่ปรึกษาได้');
    }
  };

  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName.trim() || !form.department) {
      setError('กรุณาระบุชื่อและแผนกของครูที่ปรึกษา');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, expertise: form.expertise.split(',').map((item) => item.trim()).filter(Boolean) };
      if (editingId) await api.patch(`/api/advisors/${editingId}`, payload);
      else await api.post('/api/advisors', payload);
      setForm(emptyAdvisor);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถบันทึกข้อมูลครูที่ปรึกษาได้');
    } finally { setSaving(false); }
  };

  const edit = (advisor) => {
    setEditingId(advisor._id);
    setForm({
      prefix: advisor.prefix || '', fullName: advisor.fullName || '', email: advisor.email || '', phone: advisor.phone || '',
      academicPosition: advisor.academicPosition || '', department: advisor.department?._id || advisor.department || '',
      expertise: (advisor.expertise || []).join(', '), office: advisor.office || '', isActive: advisor.isActive !== false,
    });
    setError('');
  };

  const remove = async (advisor) => {
    if (!confirm(`ต้องการลบ ${advisor.prefix || ''} ${advisor.fullName} ใช่หรือไม่?`)) return;
    try {
      await api.delete(`/api/advisors/${advisor._id}`);
      await load();
    } catch (err) { setError(err.response?.data?.error || 'ไม่สามารถลบรายชื่อได้'); }
  };

  const visibleAdvisors = advisors.filter((advisor) => {
    const query = search.trim().toLocaleLowerCase();
    return !query || `${advisor.prefix || ''} ${advisor.fullName} ${advisor.email || ''} ${advisor.departmentName || advisor.department?.name || ''}`.toLocaleLowerCase().includes(query);
  });

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900">จัดการครูที่ปรึกษา</h1><p className="text-sm text-gray-500">เพิ่ม แก้ไข และลบรายชื่อครูที่ปรึกษา</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-gray-900">{editingId ? 'แก้ไขข้อมูลครูที่ปรึกษา' : 'เพิ่มครูที่ปรึกษา'}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <input value={form.prefix} onChange={set('prefix')} placeholder="คำนำหน้า" className="rounded-lg border border-gray-300 px-3 py-2" />
        <input value={form.fullName} onChange={set('fullName')} placeholder="ชื่อ-นามสกุล *" className="rounded-lg border border-gray-300 px-3 py-2" />
        <select value={form.department} onChange={set('department')} className="rounded-lg border border-gray-300 px-3 py-2"><option value="">เลือกแผนก *</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select>
        <input value={form.email} onChange={set('email')} placeholder="อีเมล" type="email" className="rounded-lg border border-gray-300 px-3 py-2" />
        <input value={form.phone} onChange={set('phone')} placeholder="โทรศัพท์" className="rounded-lg border border-gray-300 px-3 py-2" />
        <input value={form.academicPosition} onChange={set('academicPosition')} placeholder="ตำแหน่งทางวิชาการ" className="rounded-lg border border-gray-300 px-3 py-2" />
        <input value={form.expertise} onChange={set('expertise')} placeholder="ความเชี่ยวชาญ (คั่นด้วย ,)" className="rounded-lg border border-gray-300 px-3 py-2" />
        <input value={form.office} onChange={set('office')} placeholder="ห้องพัก/สำนักงาน" className="rounded-lg border border-gray-300 px-3 py-2" />
        <label className="flex items-center gap-2 text-sm text-gray-700"><input checked={form.isActive} onChange={set('isActive')} type="checkbox" /> เปิดใช้งาน</label>
      </div>
      <div className="flex gap-2"><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มรายชื่อ'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyAdvisor); }} className="rounded-lg bg-gray-100 px-4 py-2 text-sm">ยกเลิก</button>}</div>
    </form>
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"><div className="p-4 border-b"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหารายชื่อ อีเมล หรือแผนก" className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">ชื่อ</th><th className="px-4 py-3">แผนก</th><th className="px-4 py-3">ติดต่อ</th><th className="px-4 py-3">สถานะ</th><th className="px-4 py-3 text-right">จัดการ</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleAdvisors.map((advisor) => <tr key={advisor._id}><td className="px-4 py-3 font-medium">{advisor.prefix} {advisor.fullName}<div className="text-xs text-gray-500">{advisor.academicPosition}</div></td><td className="px-4 py-3">{advisor.departmentName || advisor.department?.name || '-'}</td><td className="px-4 py-3">{advisor.email || '-'}<div className="text-xs text-gray-500">{advisor.phone}</div></td><td className="px-4 py-3">{advisor.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}</td><td className="px-4 py-3 text-right space-x-2"><button type="button" onClick={() => edit(advisor)} className="text-blue-600">แก้ไข</button><button type="button" onClick={() => remove(advisor)} className="text-red-600">ลบ</button></td></tr>)}{visibleAdvisors.length === 0 && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">ไม่พบข้อมูลครูที่ปรึกษา</td></tr>}</tbody></table></div></div>
  </div>;
}
