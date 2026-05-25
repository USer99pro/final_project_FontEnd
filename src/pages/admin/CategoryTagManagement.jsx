import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function CategoryTagManagement() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [catName, setCatName] = useState('');
  const [tagName, setTagName] = useState('');

  const load = () => {
    api.get('/api/public/categories').then((r) => setCategories(r.data));
    api.get('/api/public/tags').then((r) => setTags(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async () => {
    await api.post('/api/categories', { name: catName });
    setCatName('');
    load();
  };

  const addTag = async () => {
    await api.post('/api/tags', { name: tagName });
    setTagName('');
    load();
  };

  return (
    <div>
      <h1>หมวดหมู่และแท็ก</h1>
      <section>
        <h2>หมวดหมู่</h2>
        <div className="inline-form">
          <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="ชื่อหมวดหมู่" />
          <button type="button" onClick={addCategory}>
            เพิ่ม
          </button>
        </div>
        <ul>
          {categories.map((c) => (
            <li key={c._id}>{c.name}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>แท็ก</h2>
        <div className="inline-form">
          <input value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="ชื่อแท็ก" />
          <button type="button" onClick={addTag}>
            เพิ่ม
          </button>
        </div>
        <ul>
          {tags.map((t) => (
            <li key={t._id}>{t.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
