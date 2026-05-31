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
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          สืบค้นผลงานวิจัย
        </h1>
      </div>
  
      {/* Search */}
      <div className="mb-10">
        <SearchBar
          filters={filters}
          onChange={setFilters}
          onSearch={() => load(filters)}
        />
      </div>
  
      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-lg text-gray-500 animate-pulse">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      ) : (
        <>
          {/* Empty */}
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">ไม่พบผลงานวิจัย</p>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {projects.map((p) => (
                <WorkCard key={p._id} work={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
