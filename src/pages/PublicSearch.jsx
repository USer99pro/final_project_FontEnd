/**
 * PublicSearch Page (Index / Home)
 * ========================================
 * Main landing page for the Research Portal
 *
 * Layout:
 * 1. Hero Banner (gradient background)
 * 2. Search Section (large search bar + popular tags)
 * 3. Statistics (4 stat cards)
 * 4. Category Grid (responsive grid)
 * 5. Latest Research Table (with pagination)
 * 6. Footer
 *
 * Logic preserved from original:
 * - API call to /api/public/projects with filters
 * - Search by q, studentName, major, academicYear
 * - Loading and empty states
 */
import { useEffect, useState, useRef } from 'react';
import api from '../api/client';

// Section Components
import HeroSection from '../components/public/HeroSection';
import SearchSection from '../components/public/SearchSection';
import StatisticsSection from '../components/public/StatisticsSection';
import CategoryGrid from '../components/public/CategoryGrid';
import ResearchTable from '../components/public/ResearchTable';
import PublicFooter from '../components/public/PublicFooter';

export default function PublicSearch() {
  // ─── State (preserved from original) ───────────────────────
  const [filters, setFilters] = useState({ q: '', studentName: '', major: '', academicYear: '' });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Additional state for enhanced UI
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalStudents: 0,
    totalMajors: 0,
    latestYear: new Date().getFullYear() + 543,
  });
  const [categories, setCategories] = useState([]);

  // Ref for scroll-to-search
  const searchRef = useRef(null);

  // ─── Load Projects (preserved logic) ───────────────────────
  const load = async (params = filters) => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/public/projects', {
        params: Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      });
      const projectList = data.projects || [];
      setProjects(projectList);

      // Compute stats from projects data
      if (projectList.length > 0) {
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

        // Build categories from project majors
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

  // ─── Initial Load ──────────────────────────────────────────
  useEffect(() => {
    load();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────
  const handleScrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleTagClick = (tag) => {
    const newFilters = { ...filters, q: tag };
    setFilters(newFilters);
    load(newFilters);
  };

  const handleSearch = () => {
    load(filters);
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="-mx-4 md:-mx-6 -mt-8">
      {/* Hero Banner Section */}
      <HeroSection onScrollToSearch={handleScrollToSearch} />

      {/* Search Section */}
      <SearchSection
        ref={searchRef}
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onTagClick={handleTagClick}
      />

      {/* Statistics Section */}
      <StatisticsSection stats={stats} />

      {/* Category Grid Section */}
      <CategoryGrid categories={categories} />

      {/* Latest Research Table Section */}
      <ResearchTable projects={projects} loading={loading} />

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
