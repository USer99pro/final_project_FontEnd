import { useEffect, useState } from 'react';
import api from '../api/client';
import SearchBar from '../components/SearchBar';
import WorkCard from '../components/WorkCard';

export default function PublicSearch() {
  const [filters, setFilters] = useState({ q: '', studentName: '', major: '', academicYear: '' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (params = filters) => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/public/projects', {
        params: Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      });
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>สืบค้นผลงานวิจัย</h1>
      <p className="subtitle">นักศึกษาปัจจุบัน — เข้าถึงได้โดยไม่ต้องล็อกอิน</p>
      <SearchBar filters={filters} onChange={setFilters} onSearch={() => load(filters)} />
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        <div className="grid">
          {projects.length === 0 ? <p>ไม่พบผลงาน</p> : projects.map((p) => <WorkCard key={p._id} work={p} />)}
        </div>
      )}
    </div>
  );
}
