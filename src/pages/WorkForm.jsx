import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, Save, FileText, Check, AlertCircle, Plus } from 'lucide-react';

export default function WorkForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
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
    status: 'draft',
  });
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/public/categories').then((res) => setCategories(res.data));
    
    if (isEdit) {
      api.get(`/api/contents/${id}`).then((res) => {
        const w = res.data;
        setForm({
          title: w.title,
          description: w.description || '',
          abstract: w.abstract || '',
          academicYear: w.academicYear || '',
          major: w.major || '',
          studentName: w.studentName || '',
          category: w.category?._id || '',
          // Keep the readable keyword, not the database ID, so users can edit it.
          keywords: (w.keywords || w.tags || [])
            .map((tag) => (typeof tag === 'string' ? tag : tag.name))
            .filter(Boolean),
          status: w.status || 'draft',
        });
      });
    }
  }, [id, isEdit]);

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

  const handleAction = async (e, targetStatus) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const body = new FormData();
    // Use targetStatus if provided (e.g. from Save Draft button), otherwise use form.status
    const finalStatus = targetStatus || form.status;
    
    const submission = {
      ...form,
      // The API accepts an array (or comma-separated text); the UI keeps an array
      // so users can add and remove individual keywords easily.
      keywords: form.keywords,
      status: finalStatus,
    };
    Object.entries(submission).forEach(([k, v]) => {
      body.append(k, v);
    });
    
    if (pdf) body.append('pdf', pdf);

    try {
      if (isEdit) {
        await api.patch(`/api/contents/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/api/contents', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/graduate/works');
    } catch (err) {
      setError(err.response?.data?.error || 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10">
      
      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Top Navbar / Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <button 
            type="button" 
            onClick={() => navigate('/graduate/works')}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleAction(e, 'draft')}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Save className="w-4 h-4" />
              บันทึกร่าง
            </button>
            <button
              type="button"
              onClick={(e) => handleAction(e, 'published')}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              {isEdit ? 'บันทึกและเผยแพร่' : 'เผยแพร่ผลงาน'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-12">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'แก้ไขผลงาน' : 'เพิ่มผลงานวิจัย'}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              กรอกข้อมูลรายละเอียดของผลงานวิจัยเพื่อให้ผู้อื่นสามารถค้นหาและอ้างอิงได้
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-12">
            
            {/* Section 1: Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-100">
              <div className="md:col-span-4">
                <h2 className="text-lg font-semibold text-gray-900">1. ข้อมูลผลงานวิจัย</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ชื่อผลงาน บทคัดย่อ และรายละเอียดที่สำคัญของงานวิจัย
                </p>
              </div>
              
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผลงาน <span className="text-red-500">*</span></label>
                  <input 
                    value={form.title} 
                    onChange={set('title')} 
                    required 
                    placeholder="ระบุชื่องานวิจัย"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">บทคัดย่อ</label>
                  <textarea 
                    value={form.abstract} 
                    onChange={set('abstract')} 
                    rows={4} 
                    placeholder="สรุปย่อของงานวิจัย..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียดเพิ่มเติม</label>
                  <textarea 
                    value={form.description} 
                    onChange={set('description')} 
                    rows={3} 
                    placeholder="ข้อมูลเพิ่มเติมที่ต้องการระบุ..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Student & Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-100">
              <div className="md:col-span-4">
                <h2 className="text-lg font-semibold text-gray-900">2. ข้อมูลนักศึกษาและการศึกษา</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ข้อมูลผู้จัดทำ หมวดหมู่ และแท็กเพื่อช่วยในการค้นหา
                </p>
              </div>
              
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อนักศึกษา</label>
                    <input 
                      value={form.studentName} 
                      onChange={set('studentName')} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">สาขาวิชา</label>
                    <input 
                      value={form.major} 
                      onChange={set('major')} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                    <select 
                      value={form.category} 
                      onChange={set('category')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    >
                      <option value="">— เลือกหมวดหมู่ —</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ปีการศึกษา</label>
                    <input 
                      value={form.academicYear} 
                      onChange={set('academicYear')} 
                      placeholder="เช่น 2567"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำสำคัญ (Keyword)</label>
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
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="inline-flex items-center gap-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <Plus className="w-4 h-4" /> เพิ่ม
                    </button>
                  </div>
                  {form.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.keywords.map((keyword) => (
                        <span key={keyword} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-sm text-blue-700">
                          {keyword}
                          <button type="button" onClick={() => removeKeyword(keyword)} className="rounded-full hover:text-blue-950" aria-label={`ลบคำสำคัญ ${keyword}`}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">พิมพ์คำสำคัญแล้วกด Enter หรือปุ่มเพิ่ม สามารถใส่หลายคำโดยคั่นด้วยลูกน้ำ</p>
                </div>
              </div>
            </div>

            {/* Section 3: File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4">
                <h2 className="text-lg font-semibold text-gray-900">3. เอกสารและสถานะ</h2>
                <p className="text-sm text-gray-500 mt-1">
                  อัปโหลดไฟล์ PDF ของงานวิจัยเพื่อเผยแพร่
                </p>
              </div>
              
              <div className="md:col-span-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">อัปโหลดไฟล์ (PDF)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition cursor-pointer relative">
                    <div className="space-y-2 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>เลือกไฟล์ PDF</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            accept="application/pdf" 
                            className="sr-only"
                            onChange={(e) => setPdf(e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {pdf ? `เลือกไฟล์แล้ว: ${pdf.name}` : 'หรือลากไฟล์มาวางที่นี่'}
                      </p>
                      <p className="text-xs text-gray-400">PDF สูงสุด 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะการแสดงผล</label>
                  <select 
                    value={form.status} 
                    onChange={set('status')}
                    className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
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
    </div>
  );
}
