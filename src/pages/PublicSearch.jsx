import { useEffect, useState, useRef, useMemo } from 'react';
import api from '../api/client';

import HeroSection from '../components/public/HeroSection';
import SearchSection from '../components/public/SearchSection';
import ResearchTable from '../components/public/ResearchTable';
import StatisticsSection from '../components/public/StatisticsSection';
import CategoryGrid from '../components/public/CategoryGrid';
import PublicFooter from '../components/public/PublicFooter';

export default function PublicSearch() {
  const [filters, setFilters] = useState({ q: '', studentName: '', major: '', academicYear: '' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalStudents: 0,
    totalMajors: 0,
    latestYear: new Date().getFullYear() + 543,
  });
  const [categories, setCategories] = useState([]);

  const statsLoadedRef = useRef(false);
  const searchRef = useRef(null);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/public/stats');
      if (data) {
        setStats({
          totalProjects: data.totalProjects ?? 0,
          totalStudents: data.totalStudents ?? 0,
          totalMajors: data.totalMajors ?? 0,
          latestYear: data.latestYear ?? new Date().getFullYear() + 543,
        });
        statsLoadedRef.current = true;
      }
    } catch (err) {
      console.warn('Failed to load /api/public/stats, fallback to computed stats', err);
    }
  };

  const load = async (params = filters) => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/public/projects', {
        params: Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      });
      const projectList = data.projects || [];
      setProjects(projectList);

      if (projectList.length > 0) {
        // Only use fallback stats if the /api/public/stats call failed
        if (!statsLoadedRef.current) {
          const studentNames = new Set(projectList.map((p) => p.studentName).filter(Boolean));
          const majors = new Set(projectList.map((p) => p.major).filter(Boolean));
          const years = projectList.map((p) => p.academicYear).filter(Boolean);
          const latestYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear() + 543;
          setStats({
            totalProjects: projectList.length,
            totalStudents: studentNames.size,
            totalMajors: majors.size,
            latestYear,
          });
        }

        const categoryMap = {};
        projectList.forEach((p) => {
          if (p.category?.name) {
            const name = p.category.name;
            if (!categoryMap[name]) {
              categoryMap[name] = { _id: p.category._id || name, name, count: 0 };
            }
            categoryMap[name].count++;
          } else if (p.major) {
            if (!categoryMap[p.major]) {
              categoryMap[p.major] = { _id: p.major, name: p.major, count: 0 };
            }
            categoryMap[p.major].count++;
          }
        });
        setCategories(Object.values(categoryMap));
      }
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchStats();
      load();
    };
    init();
  }, []);

  const availableMajors = useMemo(() => {
    const set = new Set(projects.map((p) => p.major).filter(Boolean));
    return Array.from(set);
  }, [projects]);

  const availableYears = useMemo(() => {
    const set = new Set(projects.map((p) => p.academicYear).filter(Boolean));
    return Array.from(set).sort((a, b) => b - a);
  }, [projects]);

  const handleScrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSearch = () => {
    load(filters);
  };

  const handleSelectCategory = (catName) => {
    const newFilters = { ...filters, q: catName };
    setFilters(newFilters);
    load(newFilters);
    handleScrollToSearch();
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <HeroSection onScrollToSearch={handleScrollToSearch} />

      <SearchSection
        ref={searchRef}
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        majors={availableMajors}
        years={availableYears}
      />

      <ResearchTable projects={projects} loading={loading} />

      <StatisticsSection stats={stats} />

      <CategoryGrid categories={categories} onSelectCategory={handleSelectCategory} />

      <PublicFooter />
    </div>
  );
}
