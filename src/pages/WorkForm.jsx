import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function WorkForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    abstract: '',
    academicYear: '',
    major: user?.major || '',
    studentName: user?.fullName || '',
    category: '',
    tags: '',
    status: 'draft',
  });
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/api/public/categories'), api.get('/api/public/tags')]).then(([c, t]) => {
      setCategories(c.data);
      setTags(t.data);
    });
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
          tags: (w.tags || []).map((t) => t._id).join(','),
          status: w.status || 'draft',
        });
      });
    }
  }, [id, isEdit]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    if (pdf) body.append('pdf', pdf);

    try {
      if (isEdit) await api.patch(`/api/contents/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/api/contents', body, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/graduate/works');
    } catch (err) {
      setError(err.response?.data?.error || 'บันทึกไม่สำเร็จ');
    }
  };

  return (
    <div className="form-page">
      <h1>{isEdit ? 'แก้ไขผลงาน' : 'เพิ่มผลงานวิจัย'}</h1>
      <form onSubmit={handleSubmit} className="work-form">
        <label>
          ชื่อผลงาน *
          <input value={form.title} onChange={set('title')} required />
        </label>
        <label>
          บทคัดย่อ
          <textarea value={form.abstract} onChange={set('abstract')} rows={4} />
        </label>
        <label>
          รายละเอียด
          <textarea value={form.description} onChange={set('description')} rows={3} />
        </label>
        <label>
          ชื่อนักศึกษา
          <input value={form.studentName} onChange={set('studentName')} />
        </label>
        <label>
          สาขาวิชา
          <input value={form.major} onChange={set('major')} />
        </label>
        <label>
          ปีการศึกษา
          <input value={form.academicYear} onChange={set('academicYear')} placeholder="2567" />
        </label>
        <label>
          หมวดหมู่
          <select value={form.category} onChange={set('category')}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          แท็ก (id คั่นด้วย comma)
          <input value={form.tags} onChange={set('tags')} placeholder={tags.map((t) => t._id).slice(0, 2).join(',')} />
        </label>
        <label>
          สถานะ
          <select value={form.status} onChange={set('status')}>
            <option value="draft">draft (ฉบับร่าง)</option>
            <option value="published">published (เผยแพร่)</option>
          </select>
        </label>
        <label>
          ไฟล์ PDF
          <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">บันทึก</button>
      </form>
    </div>
  );
}
