import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import SearchableSelect from '../components/SearchableSelect';
import AddAdvisorModal from '../components/AddAdvisorModal';
import { X, Save, FileText, Check, AlertCircle, Plus, Users, GraduationCap } from 'lucide-react';

export default function WorkForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableAdvisors, setAvailableAdvisors] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [selectedAdvisorId, setSelectedAdvisorId] = useState('');
  const [isAddAdvisorModalOpen, setIsAddAdvisorModalOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    abstract: '',
    academicYear: '',
    major: user?.major || '',
    studentName: user?.fullName || '',
    category: '',
    keywords: [],
    participants: [],
    advisors: [],
    status: 'draft',
  });
  const [pdf, setPdf] = useState(null);
  const [hasExistingPdf, setHasExistingPdf] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdvisors = useCallback(async () => {
    try {
      const [publicRes, adminRes] = await Promise.allSettled([
        api.get('/api/public/advisors', { params: { limit: 1000 } }),
        api.get('/api/advisors', { params: { isActive: 'all', limit: 1000 } }),
      ]);

      const publicList = publicRes.status === 'fulfilled' ? (publicRes.value.data?.advisors || publicRes.value.data || []) : [];
      const adminList = adminRes.status === 'fulfilled' ? (adminRes.value.data?.advisors || adminRes.value.data || []) : [];

      const map = new Map();
      [...publicList, ...adminList].forEach((adv) => {
        if (adv && (adv._id || adv.id)) {
          const key = String(adv._id || adv.id);
          map.set(key, { ...map.get(key), ...adv });
        }
      });

      setAvailableAdvisors(Array.from(map.values()));
    } catch {
      setAvailableAdvisors([]);
    }
  }, []);

  useEffect(() => {
    api
      .get('/api/public/categories')
      .then((res) => setCategories(res.data.categories || res.data || []))
      .catch(() => {});

    fetchAdvisors();
    
    if (isEdit) {
      api.get(`/api/contents/${id}`).then((res) => {
        const w = res.data.work || res.data;
        setForm({
          title: w.title || '',
          description: w.description || '',
          abstract: w.abstract || '',
          academicYear: w.academicYear || '',
          major: w.major || '',
          studentName: w.studentName || '',
          category: w.category?._id || w.category || '',
          keywords: (w.keywords || w.tags || [])
            .map((tag) => (typeof tag === 'string' ? tag : tag.name))
            .filter(Boolean),
          participants: (w.participants || [])
            .map((p) => (typeof p === 'string' ? p : p._id))
            .filter(Boolean),
          advisors: (w.advisors || (w.advisor ? [w.advisor] : []))
            .map((advisor) => (typeof advisor === 'string' ? advisor : advisor._id))
            .filter(Boolean),
          status: w.status || 'draft',
        });
        setHasExistingPdf(Boolean(w.hasPdf || w.pdfFilename || w.pdfUrl));
      });
    }
  }, [id, isEdit, user?.major, fetchAdvisors]);

  const department = form.major || user?.major || '';

  // advisors limit: maximum 3 advisors per research work (N-to-N)
  const advisorLimit = 3;

  useEffect(() => {
    if (!department) return;

    const usersRequest =
      user?.role === 'admin'
        ? api.get('/api/admin/users', { params: { major: department, isActive: 'true' } }).catch(() =>
            api.get('/api/users', { params: { major: department } })
          )
        : api.get('/api/users', { params: { major: department } });

    usersRequest
      .then((res) => setAvailableUsers(res.data.users || res.data || []))
      .catch(() => setAvailableUsers([]));

    fetchAdvisors();
  }, [department, user?.role, fetchAdvisors]);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setError('');
  };

  const addKeyword = () => {
    const keywords = keywordInput
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (!keywords.length) return;

    setForm((current) => ({
      ...current,
      keywords: [...new Set([...current.keywords, ...keywords])],
    }));
    setKeywordInput('');
  };

  const removeKeyword = (keyword) => {
    setForm((current) => ({
      ...current,
      keywords: current.keywords.filter((item) => item !== keyword),
    }));
  };

  const addParticipant = (pId) => {
    const targetId = pId || selectedParticipantId;
    if (!targetId) return;
    if (form.participants.includes(targetId)) {
      setSelectedParticipantId('');
      return;
    }
    setForm((current) => ({
      ...current,
      participants: [...current.participants, targetId],
    }));
    setSelectedParticipantId('');
  };

  const removeParticipant = (pId) => {
    setForm((current) => ({
      ...current,
      participants: current.participants.filter((id) => id !== pId),
    }));
  };

  const addAdvisor = (advId) => {
    const targetId = advId || selectedAdvisorId;
    if (!targetId || form.advisors.includes(targetId)) return;
    if (form.advisors.length >= advisorLimit) {
      alert(`เพิ่มครูที่ปรึกษาได้สูงสุด ${advisorLimit} รายชื่อ`);
      return;
    }
    setForm((current) => ({ ...current, advisors: [...current.advisors, targetId] }));
    setSelectedAdvisorId('');
  };

  const removeAdvisor = (advisorId) => {
    setForm((current) => ({ ...current, advisors: current.advisors.filter((id) => id !== advisorId) }));
  };

  const handleAdvisorAdded = async (newAdvisor) => {
    await fetchAdvisors();
    const newId = newAdvisor?._id || newAdvisor?.id;
    if (newId && !form.advisors.includes(newId)) {
      if (form.advisors.length < advisorLimit) {
        setForm((current) => ({
          ...current,
          advisors: [...current.advisors, newId],
        }));
      }
    }
  };

  const handleSelectExistingAdvisor = (advisor) => {
    const targetId = advisor?._id || advisor?.id;
    if (targetId && !form.advisors.includes(targetId)) {
      if (form.advisors.length < advisorLimit) {
        setForm((current) => ({
          ...current,
          advisors: [...current.advisors, targetId],
        }));
      } else {
        alert(`เพิ่มครูที่ปรึกษาได้สูงสุด ${advisorLimit} รายชื่อ`);
      }
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
      e.target.value = '';
      setPdf(null);
      return;
    }
    setPdf(file);
  };

  const handleAction = async (e, targetStatus) => {
    e.preventDefault();
    setError('');
    const finalStatus = targetStatus || form.status;

    if (pdf && (pdf.type !== 'application/pdf' || !pdf.name.toLowerCase().endsWith('.pdf'))) {
      alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
      return;
    }
    if (finalStatus === 'published' && !pdf && !hasExistingPdf) {
      alert('กรุณาอัปโหลดไฟล์ PDF ก่อนเผยแพร่ผลงาน');
      return;
    }
    setIsSubmitting(true);
    
    const body = new FormData();
    
    const submission = {
      ...form,
      status: finalStatus,
    };

    Object.entries(submission).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((item) => body.append(k, item));
      } else {
        body.append(k, v);
      }
    });
    
    if (pdf) {
      body.append('pdf', pdf);
    }

    try {
      if (isEdit) {
        if (user?.role === 'admin') {
          await api.patch(`/api/admin/works/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() =>
            api.patch(`/api/contents/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } })
          );
        } else {
          await api.patch(`/api/contents/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      } else {
        await api.post('/api/contents', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate(user?.role === 'admin' ? '/admin/works' : '/graduate/works');
    } catch (err) {
      setError(err.response?.data?.error || 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10">
      
      {/* Main Card */}
      <div className="bg-surface-main rounded-xl shadow-sm border border-border-subtle overflow-hidden">
        
        {/* Top Navbar / Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-muted/80">
          <button 
            type="button" 
            onClick={() => navigate(user?.role === 'admin' ? '/admin/works' : '/graduate/works')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-on-surface-variant hover:text-on-background bg-surface-accent hover:bg-surface-container-low border border-border-strong rounded-xl focus:outline-none focus:ring-2 focus:ring-outline transition text-xs font-bold cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
            <span>ปิดหน้าต่าง / ย้อนกลับ</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleAction(e, 'draft')}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-on-background bg-surface-main border border-border-strong hover:bg-surface-muted rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-outline transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-text-secondary" />
              <span>บันทึกร่าง</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleAction(e, 'published')}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-container hover:bg-primary active:opacity-80 rounded-xl shadow-md shadow-primary-container/20 focus:outline-none focus:ring-4 focus:ring-primary-fixed/30 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-white" />
              <span>{isEdit ? 'บันทึกและเผยแพร่' : 'เผยแพร่ผลงาน'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-on-background">
              {isEdit ? 'แก้ไขผลงาน' : 'เพิ่มผลงานวิจัย'}
            </h1>
            <p className="text-text-secondary mt-2 text-sm">
              กรอกข้อมูลรายละเอียดของผลงานวิจัย เพิ่มผู้ร่วมจัดทำ และอัปโหลดไฟล์เอกสาร
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-error-container border border-error/30 rounded-xl flex items-start gap-3 text-error text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-12">
            
            {/* Section 1: Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-border-subtle">
              <div className="md:col-span-4">
                <h2 className="text-lg font-semibold text-on-background">1. ข้อมูลผลงานวิจัย</h2>
                <p className="text-sm text-text-secondary mt-1">
                  ชื่อผลงาน บทคัดย่อ และรายละเอียดที่สำคัญของงานวิจัย
                </p>
              </div>
              
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">ชื่อผลงาน <span className="text-error">*</span></label>
                  <input 
                    value={form.title} 
                    onChange={set('title')} 
                    required 
                    placeholder="ระบุชื่องานวิจัย"
                    className="w-full px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">บทคัดย่อ</label>
                  <textarea 
                    value={form.abstract} 
                    onChange={set('abstract')} 
                    rows={4} 
                    placeholder="สรุปย่อของงานวิจัย..."
                    className="w-full px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">รายละเอียดเพิ่มเติม</label>
                  <textarea 
                    value={form.description} 
                    onChange={set('description')} 
                    rows={3} 
                    placeholder="ข้อมูลเพิ่มเติมที่ต้องการระบุ..."
                    className="w-full px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Student, Participants & Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-border-subtle">
              <div className="md:col-span-4">
                <h2 className="text-lg font-semibold text-on-background">2. ผู้จัดทำและหมวดหมู่</h2>
                <p className="text-sm text-text-secondary mt-1">
                  ข้อมูลผู้จัดทำหลัก ผู้ร่วมจัดทำ หมวดหมู่ และแท็ก
                </p>
              </div>
              
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">ชื่อผู้จัดทำหลัก</label>
                    <input 
                      value={form.studentName} 
                      onChange={set('studentName')} 
                      className="w-full px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">สาขาวิชา</label>
                    <input 
                      value={form.major} 
                      readOnly
                      className="w-full px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition bg-surface-muted text-on-surface-variant"
                    />
                  </div>
                </div>

                {/* Project Participants (ผู้ร่วมจัดทำโครงการ) */}
                <div className="p-4 bg-insight-tint/50 border border-primary-fixed rounded-xl space-y-3">
                  <label className="block text-sm font-semibold text-on-background flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-container" />
                    เพิ่มผู้ร่วมจัดทำโครงการ (Project Participants)
                  </label>
                  <p className="text-xs text-text-secondary">
                    แสดงเฉพาะผู้ใช้ในแผนก {department} เพื่อเพิ่มเป็นผู้ร่วมจัดทำผลงานวิจัยนี้
                  </p>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={availableUsers
                          .filter((u) => u._id !== user?._id && u.major === department && !form.participants.includes(u._id))
                          .map((u) => ({ value: u._id, label: u.fullName, sublabel: u.studentId }))}
                        value={selectedParticipantId}
                        onChange={(val) => {
                          setSelectedParticipantId(val);
                          if (val) addParticipant(val);
                        }}
                        placeholder="— ค้นหาและเลือกผู้ร่วมจัดทำโครงการ —"
                        searchPlaceholder="พิมพ์ค้นหาชื่อเพื่อนหรือรหัสนักศึกษา..."
                        icon={Users}
                      />
                    </div>
                  </div>

                  {/* Display Selected Participants */}
                  {form.participants.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {form.participants.map((pId) => {
                        const pUser = availableUsers.find((u) => u._id === pId);
                        const displayName = pUser ? pUser.fullName : pId;
                        return (
                          <span
                            key={pId}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-main border border-primary-fixed px-3 py-1.5 text-xs font-medium text-primary shadow-sm"
                          >
                            <Users className="w-3.5 h-3.5 text-primary-container" />
                            {displayName}
                            <button
                              type="button"
                              onClick={() => removeParticipant(pId)}
                              className="ml-1 w-4 h-4 flex items-center justify-center rounded text-primary-fixed-dim hover:text-white hover:bg-error transition cursor-pointer"
                              aria-label={`ลบ ${displayName}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Advisor Selection */}
                <div className="p-4 bg-insight-tint/50 border border-primary-fixed rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="block text-sm font-semibold text-on-background flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary-container" /> ครูที่ปรึกษา <span className="text-xs text-primary font-medium">(เลือกได้สูงสุด 3 ท่าน — สามารถเลือกครูที่ปรึกษานอกแผนกได้)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddAdvisorModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
                      title="เพิ่มข้อมูลครูที่ปรึกษาท่านใหม่เข้าระบบ"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                      <span> เพิ่มครูที่ปรึกษาท่านใหม่</span>
                    </button>
                  </div>
                  <p className="text-xs text-text-secondary">พิมพ์ค้นหาชื่อ คำนำหน้า อีเมล หรือแผนกวิชาของครูที่ปรึกษา หากไม่มีในระบบสามารถกดปุ่มเพิ่มครูที่ปรึกษาใหม่ได้</p>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={availableAdvisors
                          .filter((adv) => !form.advisors.includes(adv._id))
                          .map((adv) => {
                            const dept = adv.departmentName || adv.department?.name || (typeof adv.department === 'string' ? adv.department : '');
                            const position = adv.academicPosition ? ` (${adv.academicPosition})` : '';
                            const subParts = [dept, adv.email].filter(Boolean);
                            return {
                              value: adv._id,
                              label: `${adv.prefix || ''} ${adv.fullName}${position}`.trim(),
                              sublabel: subParts.join(' • ') || 'ครูที่ปรึกษา',
                            };
                          })}
                        value={selectedAdvisorId}
                        onChange={(val) => {
                          setSelectedAdvisorId(val);
                          if (val) addAdvisor(val);
                        }}
                        disabled={form.advisors.length >= advisorLimit}
                        placeholder="— ค้นหาและเลือกครูที่ปรึกษา"
                        searchPlaceholder="พิมพ์ค้นหาชื่อ, อีเมล หรือแผนกวิชาครูที่ปรึกษา..."
                        icon={GraduationCap}
                      />
                    </div>
                  </div>
                  {form.advisors.length > 0 && <div className="flex flex-wrap gap-2 pt-2">
                    {form.advisors.map((advisorId) => {
                      const advisor = availableAdvisors.find((item) => item._id === advisorId);
                      const advisorDept = advisor?.departmentName || advisor?.department?.name || (typeof advisor?.department === 'string' ? advisor.department : '');
                      const position = advisor?.academicPosition ? ` • ${advisor.academicPosition}` : '';
                      return <span key={advisorId} className="inline-flex items-center gap-1.5 rounded-lg bg-surface-main border border-primary-fixed px-3 py-1.5 text-xs font-medium text-primary shadow-sm">
                        <GraduationCap className="w-3.5 h-3.5 text-primary-container" />
                        {advisor ? `${advisor.prefix || ''} ${advisor.fullName}${position}${advisorDept ? ` (${advisorDept})` : ''}` : advisorId}
                        <button type="button" onClick={() => removeAdvisor(advisorId)} className="ml-1 w-4 h-4 flex items-center justify-center rounded text-primary-fixed-dim hover:text-white hover:bg-error transition cursor-pointer" aria-label="ลบครูที่ปรึกษา"><X className="w-3 h-3" /></button>
                      </span>;
                    })}
                  </div>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">หมวดหมู่</label>
                    <SearchableSelect
                      options={categories.map((c) => ({ value: c._id, label: c.name }))}
                      value={form.category}
                      onChange={(val) => setForm({ ...form, category: val })}
                      placeholder="— ค้นหาและเลือกหมวดหมู่ —"
                      searchPlaceholder="พิมพ์ค้นหาหมวดหมู่..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-2">ปีการศึกษา</label>
                    <input 
                      value={form.academicYear} 
                      onChange={set('academicYear')} 
                      placeholder="เช่น 2567"
                      className="w-full px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">คำสำคัญ (Keyword)</label>
                  <div className="flex gap-2">
                    <input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      placeholder="เช่น AI, ระบบแนะนำ, การศึกษา"
                      className="flex-1 px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-primary-container hover:bg-primary active:opacity-80 text-white font-bold text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-fixed transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      <span>เพิ่ม</span>
                    </button>
                  </div>
                  {form.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.keywords.map((keyword) => (
                        <span key={keyword} className="inline-flex items-center gap-1.5 rounded-full bg-insight-tint border border-primary-fixed px-3 py-1 text-sm font-semibold text-primary">
                          {keyword}
                          <button type="button" onClick={() => removeKeyword(keyword)} className="w-4 h-4 flex items-center justify-center rounded-full text-primary-fixed-dim hover:text-white hover:bg-error transition cursor-pointer" aria-label={`ลบคำสำคัญ ${keyword}`}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-outline mt-2">พิมพ์คำสำคัญแล้วกด Enter หรือปุ่มเพิ่ม สามารถใส่หลายคำโดยคั่นด้วยลูกน้ำ</p>
                </div>
              </div>
            </div>

            {/* Section 3: File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h2 className="text-lg font-semibold text-on-background">3. เอกสารและสถานะ</h2>
                <p className="text-sm text-text-secondary mt-1">
                  อัปโหลดไฟล์ PDF ของงานวิจัยเพื่อเผยแพร่
                </p>
              </div>
              
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">อัปโหลดไฟล์ (PDF)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-strong border-dashed rounded-xl hover:bg-surface-muted transition cursor-pointer relative">
                    <div className="space-y-2 text-center">
                      <FileText className="mx-auto h-12 w-12 text-outline" />
                      <div className="flex text-sm text-text-secondary justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-surface-main rounded-md font-medium text-primary-container hover:text-primary-container focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-fixed">
                          <span>เลือกไฟล์ PDF</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            accept="application/pdf,.pdf"
                            className="sr-only"
                            onChange={handlePdfChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-text-secondary">
                        {pdf
                          ? `เลือกไฟล์แล้ว: ${pdf.name}`
                          : hasExistingPdf
                            ? 'มีไฟล์ PDF อยู่แล้ว — เลือกไฟล์ใหม่เพื่อแทนที่'
                            : 'หรือลากไฟล์มาวางที่นี่'}
                      </p>
                      <p className="text-xs text-outline">รองรับเฉพาะไฟล์ PDF สูงสุด 15MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">สถานะการแสดงผล</label>
                  <select 
                    value={form.status} 
                    onChange={set('status')}
                    className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary-fixed focus:border-primary-container outline-none transition bg-surface-main"
                  >
                    <option value="draft">บันทึกเป็นแบบร่าง (Draft)</option>
                    <option value="published">เผยแพร่สาธารณะ (Published)</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* Add Advisor Modal */}
      <AddAdvisorModal
        isOpen={isAddAdvisorModalOpen}
        onClose={() => setIsAddAdvisorModalOpen(false)}
        onSuccess={handleAdvisorAdded}
        onSelectExisting={handleSelectExistingAdvisor}
        existingAdvisors={availableAdvisors}
        defaultDepartment={form.major || user?.major || ''}
      />
    </div>
  );
}
