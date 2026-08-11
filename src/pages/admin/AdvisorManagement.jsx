import { useEffect, useState } from 'react';
import api from '../../api/client';
import SearchableSelect from '../../components/SearchableSelect';
import { GraduationCap, Plus, Search, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw, X, UserCheck, Mail, Phone, Building } from 'lucide-react';

const emptyAdvisor = {
  prefix: '',
  fullName: '',
  email: '',
  phone: '',
  academicPosition: '',
  department: '',
  expertise: '',
  office: '',
  isActive: true,
};

export default function AdvisorManagement() {
  const [advisors, setAdvisors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyAdvisor);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [advisorRes, departmentRes] = await Promise.all([
        api.get('/api/advisors', { params: { isActive: 'all', limit: 200 } }),
        api.get('/api/departments'),
      ]);
      setAdvisors(advisorRes.data.advisors || []);
      setDepartments(departmentRes.data.departments || departmentRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถโหลดรายชื่อครูที่ปรึกษาได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) =>
    setForm((current) => ({
      ...current,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName.trim() || !form.department) {
      setError('กรุณาระบุชื่อ-นามสกุล และเลือกแผนกของครูที่ปรึกษา');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        expertise: typeof form.expertise === 'string'
          ? form.expertise.split(',').map((item) => item.trim()).filter(Boolean)
          : form.expertise,
      };

      if (editingId) {
        await api.patch(`/api/advisors/${editingId}`, payload);
        setSuccess('แก้ไขข้อมูลครูที่ปรึกษาสำเร็จ');
      } else {
        await api.post('/api/advisors', payload);
        setSuccess('เพิ่มข้อมูลครูที่ปรึกษาสำเร็จ');
      }

      setForm(emptyAdvisor);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถบันทึกข้อมูลครูที่ปรึกษาได้');
    } finally {
      setSaving(false);
    }
  };

  const edit = (advisor) => {
    setEditingId(advisor._id);
    setForm({
      prefix: advisor.prefix || '',
      fullName: advisor.fullName || '',
      email: advisor.email || '',
      phone: advisor.phone || '',
      academicPosition: advisor.academicPosition || '',
      department: advisor.department?._id || advisor.department || '',
      expertise: Array.isArray(advisor.expertise) ? advisor.expertise.join(', ') : (advisor.expertise || ''),
      office: advisor.office || '',
      isActive: advisor.isActive !== false,
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (advisor) => {
    if (!confirm(`ยืนยันการลบข้อมูลครูที่ปรึกษา "${advisor.prefix || ''} ${advisor.fullName}" ใช่หรือไม่?`)) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/api/advisors/${advisor._id}`);
      setSuccess(`ลบข้อมูล ${advisor.fullName} เรียบร้อยแล้ว`);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'ไม่สามารถลบรายชื่อได้');
    }
  };

  const visibleAdvisors = advisors.filter((advisor) => {
    const query = search.trim().toLowerCase();
    const deptName = advisor.departmentName || advisor.department?.name || '';
    return (
      !query ||
      `${advisor.prefix || ''} ${advisor.fullName} ${advisor.email || ''} ${deptName}`
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in pt-6">
      {/* PAGE HEADER */}
      <div className="bg-gradient-to-r from-teal-800 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 mb-3 border border-white/10">
            <GraduationCap className="w-4 h-4 text-teal-300" /> Advisor Management
          </div>
          <h1 className="text-3xl font-bold">จัดการข้อมูลครูที่ปรึกษา</h1>
          <p className="text-teal-100 text-sm mt-1">
            เพิ่ม แก้ไข ลบข้อมูล และบริหารจัดการครูที่ปรึกษาในแต่ละแผนกวิชา
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <span className="flex-1">{success}</span>
          <button type="button" onClick={() => setSuccess('')} className="text-emerald-400 hover:text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FORM CARD */}
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'แก้ไขข้อมูลครูที่ปรึกษา' : 'เพิ่มรายชื่อครูที่ปรึกษาใหม่'}
              </h2>
              <p className="text-xs text-gray-400">กรอกข้อมูลรายละเอียดเพื่อบันทึกลงในระบบ</p>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyAdvisor);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg transition"
            >
              ยกเลิกการแก้ไข
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Prefix */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">คำนำหน้า</label>
            <input
              value={form.prefix}
              onChange={set('prefix')}
              placeholder="เช่น ดร., ผศ.ดร., อ."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              value={form.fullName}
              onChange={set('fullName')}
              placeholder="เช่น สมชาย ใจดี"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>

          {/* Department (Searchable Select) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              แผนก / สาขาวิชา <span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              options={departments.map((d) => ({ value: d._id, label: d.name }))}
              value={form.department}
              onChange={(val) => setForm({ ...form, department: val })}
              placeholder="-- เลือกแผนกวิชา --"
              searchPlaceholder="พิมพ์ค้นหาแผนก..."
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">อีเมล</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="advisor@school.ac.th"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">เบอร์โทรศัพท์</label>
            <input
              value={form.phone}
              onChange={set('phone')}
              placeholder="08X-XXX-XXXX"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>

          {/* Academic Position */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">ตำแหน่งทางวิชาการ</label>
            <input
              value={form.academicPosition}
              onChange={set('academicPosition')}
              placeholder="เช่น อาจารย์ประจำ, หัวหน้าแผนก"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>

          {/* Expertise */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">ความเชี่ยวชาญ (คั่นด้วย ,)</label>
            <input
              value={form.expertise}
              onChange={set('expertise')}
              placeholder="เช่น AI, Web Development, Database"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>

          {/* Office */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">ห้องพัก / อาคาร</label>
            <input
              value={form.office}
              onChange={set('office')}
              placeholder="เช่น อาคาร 3 ห้อง 302"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm outline-none transition"
            />
          </div>
        </div>

        {/* Active status & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={set('isActive')}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <span>เปิดใช้งานรายชื่อนี้ในระบบ (Active)</span>
          </label>

          <div className="flex items-center gap-3">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyAdvisor);
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                ยกเลิก
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-teal-500/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{editingId ? 'บันทึกการแก้ไข' : 'เพิ่มครูที่ปรึกษา'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* LIST TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Search Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหารายชื่อ คำนำหน้า อีเมล หรือแผนกวิชา..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            แสดง {visibleAdvisors.length} จากทั้งหมด {advisors.length} รายชื่อ
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">ชื่อ-นามสกุล / ตำแหน่ง</th>
                <th className="px-6 py-4">แผนก / สาขาวิชา</th>
                <th className="px-6 py-4">ช่องทางติดต่อ</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
                <th className="px-6 py-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    กำลังโหลดรายชื่อครูที่ปรึกษา...
                  </td>
                </tr>
              ) : visibleAdvisors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    ไม่พบข้อมูลครูที่ปรึกษา
                  </td>
                </tr>
              ) : (
                visibleAdvisors.map((advisor) => {
                  const deptName = advisor.departmentName || advisor.department?.name || '-';
                  return (
                    <tr key={advisor._id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {advisor.prefix} {advisor.fullName}
                        </div>
                        {advisor.academicPosition && (
                          <div className="text-xs text-gray-400 mt-0.5">{advisor.academicPosition}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 text-xs font-medium">
                          <Building className="w-3.5 h-3.5" />
                          {deptName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 space-y-1">
                        {advisor.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{advisor.email}</span>
                          </div>
                        )}
                        {advisor.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{advisor.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {advisor.isActive !== false ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            เปิดใช้งาน
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            ปิดใช้งาน
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => edit(advisor)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-semibold transition"
                            title="แก้ไข"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(advisor)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white text-xs font-semibold transition cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
