import { useState, useEffect, useMemo } from 'react';
import api from '../api/client';
import SearchableSelect from './SearchableSelect';
import {
  GraduationCap,
  X,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Briefcase,
  Sparkles,
  Check,
} from 'lucide-react';

const COMMON_PREFIXES = ['ดร.', 'ผศ.ดร.', 'ผศ.', 'รศ.ดร.', 'รศ.', 'ศ.ดร.', 'อาจารย์', 'อ.'];
const COMMON_POSITIONS = [
  'อาจารย์',
  'ผู้ช่วยศาสตราจารย์',
  'รองศาสตราจารย์',
  'ศาสตราจารย์',
  'หัวหน้าแผนก',
  'ครูชำนาญการ',
  'อาจารย์พิเศษ',
];

const emptyForm = {
  prefix: '',
  fullName: '',
  academicPosition: '',
  department: '',
  email: '',
  phone: '',
  expertise: '',
  office: '',
};

export default function AddAdvisorModal({
  isOpen,
  onClose,
  onSuccess,
  onSelectExisting,
  existingAdvisors = [],
  defaultDepartment = '',
}) {
  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load departments when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setSuccess('');
    setSaving(false);
    setForm({
      ...emptyForm,
      department: defaultDepartment || '',
    });

    setLoadingDepts(true);
    Promise.allSettled([
      api.get('/api/departments'),
      api.get('/api/public/departments'),
    ])
      .then(([res1, res2]) => {
        const list1 = res1.status === 'fulfilled' ? (res1.value.data?.departments || res1.value.data || []) : [];
        const list2 = res2.status === 'fulfilled' ? (res2.value.data?.departments || res2.value.data || []) : [];
        const combined = [...list1, ...list2];
        const map = new Map();
        combined.forEach((dept) => {
          if (dept && (dept._id || dept.id || dept.name)) {
            const key = dept._id || dept.id || dept.name;
            map.set(key, dept);
          }
        });
        setDepartments(Array.from(map.values()));
      })
      .finally(() => {
        setLoadingDepts(false);
      });
  }, [isOpen, defaultDepartment]);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setError('');
  };

  // Helper to normalize strings for comparison
  const normalize = (str) =>
    (str || '')
      .toString()
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  // Check duplicate advisor by both Name and Academic Position
  const duplicateAdvisor = useMemo(() => {
    const inputFullName = normalize(form.fullName);
    const inputPrefix = normalize(form.prefix);
    const inputCombined = normalize(`${form.prefix || ''} ${form.fullName || ''}`);
    const inputPosition = normalize(form.academicPosition);

    if (!inputFullName || !inputPosition) return null;

    return existingAdvisors.find((adv) => {
      if (!adv) return false;
      const advFullName = normalize(adv.fullName);
      const advPrefix = normalize(adv.prefix);
      const advCombined = normalize(`${adv.prefix || ''} ${adv.fullName || ''}`);
      const advPosition = normalize(adv.academicPosition);

      // Check if name matches (either fullName or combined prefix+fullName)
      const nameMatch =
        advFullName === inputFullName ||
        advCombined === inputCombined ||
        (advFullName && inputCombined.includes(advFullName)) ||
        (inputFullName && advCombined.includes(inputFullName));

      // Check if position matches
      const positionMatch = advPosition === inputPosition;

      return nameMatch && positionMatch;
    });
  }, [form.fullName, form.prefix, form.academicPosition, existingAdvisors]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName.trim()) {
      setError('กรุณากรอกชื่อ-นามสกุลของครูที่ปรึกษา');
      return;
    }

    if (!form.academicPosition.trim()) {
      setError('กรุณาระบุตำแหน่งทางวิชาการของครูที่ปรึกษา');
      return;
    }

    if (!form.department) {
      setError('กรุณาเลือกแผนก/สาขาวิชาของครูที่ปรึกษา');
      return;
    }

    // Duplicate Check Validation
    if (duplicateAdvisor) {
      const existingName = `${duplicateAdvisor.prefix || ''} ${duplicateAdvisor.fullName}`.trim();
      const existingDept =
        duplicateAdvisor.departmentName ||
        duplicateAdvisor.department?.name ||
        (typeof duplicateAdvisor.department === 'string' ? duplicateAdvisor.department : '');

      setError(
        `ไม่สามารถเพิ่มข้อมูลได้เนื่องจากมีครูที่ปรึกษาชื่อ "${existingName}" ในตำแหน่ง "${duplicateAdvisor.academicPosition}" อยู่ในระบบแล้ว${
          existingDept ? ` (แผนก: ${existingDept})` : ''
        }`
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        prefix: form.prefix.trim(),
        fullName: form.fullName.trim(),
        academicPosition: form.academicPosition.trim(),
        department: form.department,
        email: form.email.trim(),
        phone: form.phone.trim(),
        expertise: typeof form.expertise === 'string'
          ? form.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : form.expertise,
        office: form.office.trim(),
        isActive: true,
      };

      const res = await api.post('/api/advisors', payload);
      const createdAdvisor = res.data?.advisor || res.data;

      setSuccess('เพิ่มข้อมูลครูที่ปรึกษาเรียบร้อยแล้ว');

      if (onSuccess) {
        onSuccess(createdAdvisor || { ...payload, _id: res.data?._id || Date.now().toString() });
      }

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'ไม่สามารถบันทึกข้อมูลครูที่ปรึกษาได้ กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSelectExistingClick = () => {
    if (duplicateAdvisor && onSelectExisting) {
      onSelectExisting(duplicateAdvisor);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-inverse-surface/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-surface-main rounded-3xl shadow-2xl border border-border-subtle overflow-hidden transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-header-gradient-start to-header-gradient-end px-6 py-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-main/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <GraduationCap className="w-5 h-5 text-primary-fixed-dim" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">เพิ่มข้อมูลครูที่ปรึกษาท่านใหม่</h3>
              <p className="text-primary-fixed-dim text-xs mt-0.5">
                ระบบจะตรวจสอบชื่อและตำแหน่งทางวิชาการก่อนบันทึกเข้าระบบ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-main/10 hover:bg-surface-main/20 active:bg-surface-main/30 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* ALERT MESSAGES */}
          {error && (
            <div className="p-4 rounded-2xl bg-error-container border border-error/30 text-error text-xs sm:text-sm font-medium flex items-start gap-3 shadow-xs animate-shake">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* DUPLICATE WARNING BOX (REAL-TIME) */}
          {duplicateAdvisor && !success && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm animate-fade-in space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-amber-900">
                    พบข้อมูลครูที่ปรึกษาท่านนี้อยู่ในระบบแล้ว
                  </h4>
                  <p className="text-xs text-amber-700 mt-1">
                    มีรายชื่อ <strong className="text-amber-950 font-semibold">{duplicateAdvisor.prefix || ''} {duplicateAdvisor.fullName}</strong> ในตำแหน่ง <strong className="text-amber-950 font-semibold">{duplicateAdvisor.academicPosition}</strong> อยู่ในฐานข้อมูลระบบแล้ว จึงไม่สามารถเพิ่มซ้ำได้
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                <span className="text-xs text-amber-700">
                  แผนก: {duplicateAdvisor.departmentName || duplicateAdvisor.department?.name || (typeof duplicateAdvisor.department === 'string' ? duplicateAdvisor.department : 'ทั่วไป')}
                </span>
                {onSelectExisting && (
                  <button
                    type="button"
                    onClick={handleSelectExistingClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>เลือกครูที่ปรึกษาท่านนี้ทันที</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5">
            {/* Prefix */}
            <div className="sm:col-span-4 space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant">
                คำนำหน้า <span className="text-outline font-normal">(ถ้ามี)</span>
              </label>
              <input
                type="text"
                value={form.prefix}
                onChange={set('prefix')}
                placeholder="เช่น ดร., ผศ.ดร., อ."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_PREFIXES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, prefix: p }));
                      setError('');
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition cursor-pointer ${
                      form.prefix === p
                        ? 'bg-primary-container text-white border-primary-container shadow-xs'
                        : 'bg-surface-muted text-text-secondary border-border-subtle hover:bg-insight-tint hover:text-primary-container'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="sm:col-span-8 space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant">
                ชื่อ-นามสกุล <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="เช่น สมชาย ใจดี (ไม่ต้องใส่คำนำหน้า)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
              <p className="text-[11px] text-outline">ระบุชื่อและนามสกุลจริงของครูที่ปรึกษา</p>
            </div>

            {/* Academic Position */}
            <div className="sm:col-span-6 space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-primary-container" />
                ตำแหน่งทางวิชาการ / ตำแหน่ง <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.academicPosition}
                onChange={set('academicPosition')}
                placeholder="เช่น อาจารย์ประจำ, ผู้ช่วยศาสตราจารย์"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, academicPosition: pos }));
                      setError('');
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition cursor-pointer ${
                      form.academicPosition === pos
                        ? 'bg-primary-container text-white border-primary-container shadow-xs'
                        : 'bg-surface-muted text-text-secondary border-border-subtle hover:bg-insight-tint hover:text-primary-container'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Department */}
            <div className="sm:col-span-6 space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-primary-container" />
                แผนก / สาขาวิชา <span className="text-error">*</span>
              </label>
              <SearchableSelect
                options={departments.map((d) => ({
                  value: d._id || d.id || d.name,
                  label: d.name || d.label || d._id,
                }))}
                value={form.department}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, department: val }));
                  setError('');
                }}
                placeholder={loadingDepts ? 'กำลังโหลดแผนก...' : '— เลือกแผนก/สาขาวิชา —'}
                searchPlaceholder="พิมพ์ค้นหาแผนก..."
                disabled={loadingDepts}
              />
              <p className="text-[11px] text-outline">เลือกแผนกวิชาที่ครูที่ปรึกษาสังกัด</p>
            </div>

            {/* Email */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-outline" />
                อีเมล <span className="text-outline font-normal">(ถ้ามี)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="advisor@school.ac.th"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
            </div>

            {/* Phone */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-outline" />
                เบอร์โทรศัพท์ <span className="text-outline font-normal">(ถ้ามี)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="08X-XXX-XXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
            </div>

            {/* Expertise */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-outline" />
                ความเชี่ยวชาญ <span className="text-outline font-normal">(คั่นด้วยจุลภาค ,)</span>
              </label>
              <input
                type="text"
                value={form.expertise}
                onChange={set('expertise')}
                placeholder="เช่น Web, AI, IoT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
            </div>

            {/* Office */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant">
                ห้องพักครู / อาคาร <span className="text-outline font-normal">(ถ้ามี)</span>
              </label>
              <input
                type="text"
                value={form.office}
                onChange={set('office')}
                placeholder="เช่น อาคาร 4 ชั้น 2"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-strong focus:border-primary-container focus:ring-2 focus:ring-primary-fixed text-sm outline-none transition bg-surface-main"
              />
            </div>
          </div>

          {/* MODAL FOOTER / ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border-strong text-on-surface-variant bg-surface-main hover:bg-surface-muted font-bold text-sm transition cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={saving || Boolean(duplicateAdvisor)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm shadow-md shadow-primary-container/20 focus:outline-none focus:ring-4 focus:ring-primary-fixed/30 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังบันทึกข้อมูล...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มครูที่ปรึกษา</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
