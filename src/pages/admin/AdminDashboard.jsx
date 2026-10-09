import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  Download,
  Eye,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { analyticsService } from '../../api/analyticsService';
import AuditLogs from './AuditLogs';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const asList = (value) => {
  const data = value?.data || value?.items || value || [];
  return Array.isArray(data) ? data : [];
};

const formatNumber = (value) =>
  new Intl.NumberFormat('th-TH').format(Number(value || 0));

const PAGE_LABELS = {
  '/': 'หน้าหลัก',
  '/search': 'ค้นหาผลงาน',
  '/login': 'เข้าสู่ระบบ',
  '/register': 'สมัครสมาชิก',
  '/about': 'เกี่ยวกับ',
  '/contact': 'ติดต่อเรา',
  '/privacy': 'นโยบายความเป็นส่วนตัว',
  '/terms': 'ข้อตกลง',
};

function normalizePage(page) {
  if (!page) return 'Unknown';
  if (PAGE_LABELS[page]) return PAGE_LABELS[page];
  if (/^\/projects\//.test(page)) return 'รายละเอียดผลงาน';
  if (/^\/graduate/.test(page)) return 'พื้นที่นักศึกษา';
  if (/^\/admin/.test(page)) return 'พื้นที่ผู้ดูแล';
  return page;
}

const DEVICE_COLORS = {
  Desktop: '#3b82f6',
  Mobile: '#10b981',
  Tablet: '#f59e0b',
  Unknown: '#94a3b8',
};

const PERIOD_OPTIONS = [
  { label: '7 วันล่าสุด', value: '7d' },
  { label: '30 วันล่าสุด', value: '30d' },
  { label: '3 เดือน', value: '3m' },
  { label: '6 เดือน', value: '6m' },
  { label: '1 ปี', value: '1y' },
];

// ─── Reusable UI Sub-components ───────────────────────────────────────────────

function Panel({ title, subtitle, children, loading, error, onRetry, className = '' }) {
  return (
    <section className={`w-full min-w-0 rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-sm ${className}`}>
      <div className="mb-4">
        <h2 className="text-[17px] font-bold leading-6 text-on-background">{title}</h2>
        {subtitle && <p className="mt-1 text-xs leading-4 text-text-secondary">{subtitle}</p>}
      </div>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-5 w-1/3 rounded bg-surface-accent" />
          <div className="h-40 rounded-xl bg-surface-accent" />
        </div>
      ) : error ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center text-sm text-text-secondary">
          <span>ไม่สามารถโหลดข้อมูลได้</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 font-semibold text-on-surface-variant hover:bg-surface-accent transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> ลองอีกครั้ง
            </button>
          )}
        </div>
      ) : !children ? (
        <div className="flex min-h-40 items-center justify-center text-center text-sm text-outline">
          ไม่พบข้อมูลในช่วงเวลาหรือตัวกรองที่เลือก
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function StatCard({ label, value, growth, Icon, tone }) {
  const known = growth !== null && growth !== undefined && Number.isFinite(Number(growth));
  const up = Number(growth) >= 0;
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-on-surface-variant">{label}</span>
        <span className={`rounded-xl p-2.5 ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-on-background">{formatNumber(value)}</p>
      {known ? (
        <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-700' : 'text-rose-700'}`}>
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(Number(growth)).toFixed(1)}% <span className="font-normal text-text-secondary">จากช่วงก่อนหน้า</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-outline">สถิติรวมของระบบ</p>
      )}
    </div>
  );
}

function LineChart({ data, lines }) {
  if (!data?.length) return null;
  const xKey = data[0]?.year !== undefined ? 'year' : data[0]?.date !== undefined ? 'date' : 'label';
  return (
    <div className="h-72 w-full" role="img" aria-label="กราฟแนวโน้มข้อมูล">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 12, right: 20, bottom: 28, left: 4 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey={xKey}
            interval="preserveStartEnd"
            minTickGap={32}
            height={52}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            width={42}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,.10)' }}
            labelStyle={{ color: '#334155', fontWeight: 700 }}
            formatter={(val, name) => [formatNumber(val), name]}
          />
          <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

function BarList({ data, color = 'bg-primary-container' }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((item) => Number(item.count || 0)), 1);
  return (
    <div className="space-y-4">
      {data.slice(0, 8).map((item, index) => (
        <div key={item._id || item.name || item.keyword || index}>
          <div className="mb-1 flex justify-between gap-4 text-sm">
            <span className="truncate font-medium text-on-surface-variant">{item.name || item.label || item.keyword}</span>
            <span className="shrink-0 font-bold text-on-background">{formatNumber(item.count)}</span>
          </div>
          <div className="h-2 rounded-full bg-surface-accent">
            <div className={`h-2 rounded-full ${color}`} style={{ width: `${(Number(item.count || 0) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Merged Dashboard Component ──────────────────────────────────────────

export default function AdminDashboard() {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tabParam = searchParams.get('tab');

  const getInitialTab = () => {
    if (tabParam && ['all', 'research', 'visitors', 'audit'].includes(tabParam)) return tabParam;
    if (location.pathname.includes('/audit')) return 'audit';
    if (location.pathname.includes('/analytics')) return 'visitors';
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (location.pathname.includes('/audit')) {
      setActiveTab('audit');
    } else if (location.pathname.includes('/analytics')) {
      setActiveTab('visitors');
    } else if (tabParam && ['all', 'research', 'visitors', 'audit'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.pathname, tabParam]);

  // Filters
  const [filters, setFilters] = useState({
    academicYear: '',
    department: '',
    category: '',
    type: '',
    period: '30d',
  });

  // Research analytics state
  const [researchState, setResearchState] = useState({ loading: true, error: false, results: {} });
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [keywordTrend, setKeywordTrend] = useState({ loading: false, data: null, error: false });

  // Visitor analytics state
  const [visitorSummary, setVisitorSummary] = useState(null);
  const [visitorTrends, setVisitorTrends] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [devices, setDevices] = useState([]);
  const [visitorLoading, setVisitorLoading] = useState(true);
  const [visitorError, setVisitorError] = useState(false);

  const params = useMemo(() => ({ ...filters }), [filters]);

  // Load Research Analytics
  const loadResearch = useCallback(async () => {
    setResearchState((prev) => ({ ...prev, loading: true, error: false }));
    const calls = {
      overview: analyticsService.getOverview(params),
      worksTrend: analyticsService.getWorksTrend(params),
      department: analyticsService.getWorksByDepartment(params),
      category: analyticsService.getWorksByCategory(params),
      type: analyticsService.getWorksByType(params),
      keywords: analyticsService.getPopularKeywords(params),
      searches: analyticsService.getPopularSearches(params),
      works: analyticsService.getPopularWorks(params),
      usage: analyticsService.getUsageTrend(params),
      insights: analyticsService.getInsights(params),
    };
    const entries = Object.entries(calls);
    const settled = await Promise.allSettled(entries.map(([, req]) => req));
    const results = {};
    settled.forEach((item, index) => {
      results[entries[index][0]] = item.status === 'fulfilled' ? { data: item.value } : { error: true };
    });
    setResearchState({
      loading: false,
      error: settled.every((item) => item.status === 'rejected'),
      results,
    });
  }, [params]);

  // Load Visitor Analytics
  const loadVisitors = useCallback(async () => {
    setVisitorLoading(true);
    setVisitorError(false);
    const [summaryRes, trendsRes, topPagesRes, devicesRes] = await Promise.allSettled([
      analyticsService.getAnalyticsSummary({ period: filters.period }),
      analyticsService.getVisitorTrends({ period: filters.period }),
      analyticsService.getTopPages({ period: filters.period }),
      analyticsService.getDeviceAnalytics({ period: filters.period }),
    ]);

    if (summaryRes.status === 'fulfilled') setVisitorSummary(summaryRes.value);
    if (trendsRes.status === 'fulfilled') setVisitorTrends(Array.isArray(trendsRes.value) ? trendsRes.value : []);
    if (topPagesRes.status === 'fulfilled') {
      setTopPages((Array.isArray(topPagesRes.value) ? topPagesRes.value : []).map((p) => ({
        ...p,
        label: normalizePage(p.page),
      })));
    }
    if (devicesRes.status === 'fulfilled') setDevices(Array.isArray(devicesRes.value) ? devicesRes.value : []);

    const allFailed = [summaryRes, trendsRes, topPagesRes, devicesRes].every((r) => r.status === 'rejected');
    setVisitorError(allFailed);
    setVisitorLoading(false);
  }, [filters.period]);

  // Unified refresh
  const loadAll = useCallback(() => {
    loadResearch();
    loadVisitors();
  }, [loadResearch, loadVisitors]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Load static filter choices
  useEffect(() => {
    Promise.allSettled([analyticsService.getDepartments(), analyticsService.getCategories()]).then(([d, c]) => {
      if (d.status === 'fulfilled') setDepartments(asList(d.value));
      if (c.status === 'fulfilled') setCategories(asList(c.value));
    });
  }, []);

  // Keyword Trend loader
  const keywordData = asList(researchState.results.keywords?.data);
  const selectedKeyword = keyword || keywordData[0]?.keyword || '';
  useEffect(() => {
    if (!selectedKeyword) return;
    setKeywordTrend({ loading: true, data: null, error: false });
    analyticsService
      .getKeywordTrend({ ...params, keyword: selectedKeyword })
      .then((data) => setKeywordTrend({ loading: false, data, error: false }))
      .catch(() => setKeywordTrend({ loading: false, data: null, error: true }));
  }, [selectedKeyword, params]);

  const overview = researchState.results.overview?.data || {};
  const r = researchState.results;
  const trend = asList(r.worksTrend?.data);
  const usage = asList(r.usage?.data);
  const popularWorks = asList(r.works?.data);
  const insights = asList(r.insights?.data);

  return (
    <div className="w-full max-w-none space-y-6 pb-10 text-slate-950">
      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <header className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-950 via-[#0b2460] to-indigo-950 p-6 text-white shadow-[0_12px_30px_rgba(15,23,42,.18)] md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface-main/10 px-3 py-1 text-xs font-bold tracking-[.05em] text-blue-100">
              <BarChart3 className="h-3.5 w-3.5" />
              ADMIN DASHBOARD & ANALYTICS
            </div>
            <h1 className="text-3xl font-bold tracking-[-.02em]">ศูนย์รวมแดชบอร์ดและการวิเคราะห์ข้อมูล</h1>
            <p className="mt-2 text-sm leading-5 text-blue-100">
              สถิติภาพรวมผลงานวิจัย แนวโน้มความนิยม และการวิเคราะห์พฤติกรรมผู้เข้าชมระบบครบวงจรในหน้าเดียว
            </p>
          </div>
          <button
            type="button"
            onClick={loadAll}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            รีเฟรชข้อมูล
          </button>
        </div>
      </header>

      {/* ── Tab Switcher ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-primary-container text-white shadow-sm'
              : 'bg-surface-main text-on-surface-variant hover:bg-surface-accent border border-border-subtle'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          ภาพรวมทั้งหมด (All in One)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('research')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'research'
              ? 'bg-primary-container text-white shadow-sm'
              : 'bg-surface-main text-on-surface-variant hover:bg-surface-accent border border-border-subtle'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          สถิติผลงานวิจัย (Research Analytics)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('visitors')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'visitors'
              ? 'bg-primary-container text-white shadow-sm'
              : 'bg-surface-main text-on-surface-variant hover:bg-surface-accent border border-border-subtle'
          }`}
        >
          <Activity className="w-4 h-4" />
          ผู้เข้าชมเว็บไซต์ (Visitor Traffic)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-primary-container text-white shadow-sm'
              : 'bg-surface-main text-on-surface-variant hover:bg-surface-accent border border-border-subtle'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          บันทึก Audit Logs (ประวัติระบบ)
        </button>
      </div>

      {/* ── Filter Controls ───────────────────────────────────────────────── */}
      {activeTab !== 'audit' && (
      <section className="rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-bold text-on-background">
            <span className="rounded-lg bg-insight-tint p-1.5 text-primary">
              <Search className="h-4 w-4" />
            </span>
            ตัวกรองข้อมูล
          </div>
          <span className="text-xs text-text-secondary">
            ช่วงเวลาที่เลือก: {PERIOD_OPTIONS.find((p) => p.value === filters.period)?.label || filters.period}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Academic Year */}
          <label className="relative">
            <span className="sr-only">ปีการเผยแพร่</span>
            <input
              placeholder="ปีการเผยแพร่ เช่น 2567"
              value={filters.academicYear}
              onChange={(e) => setFilters((old) => ({ ...old, academicYear: e.target.value }))}
              className="w-full rounded-xl border border-border-strong px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {/* Department */}
          <label className="relative">
            <span className="sr-only">สาขาวิชา</span>
            <select
              value={filters.department}
              onChange={(e) => setFilters((old) => ({ ...old, department: e.target.value }))}
              className="w-full appearance-none rounded-xl border border-border-strong bg-surface-main px-3 py-2.5 pr-9 text-sm text-on-surface-variant outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">ทุกสาขาวิชา</option>
              {departments.map((item) => (
                <option key={item._id || item.name} value={item.name || item}>
                  {item.name || item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-outline" />
          </label>

          {/* Category */}
          <label className="relative">
            <span className="sr-only">หมวดหมู่</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters((old) => ({ ...old, category: e.target.value }))}
              className="w-full appearance-none rounded-xl border border-border-strong bg-surface-main px-3 py-2.5 pr-9 text-sm text-on-surface-variant outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map((item) => (
                <option key={item._id || item.name} value={item.name || item}>
                  {item.name || item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-outline" />
          </label>

          {/* Type */}
          <input
            value={filters.type}
            onChange={(e) => setFilters((old) => ({ ...old, type: e.target.value }))}
            placeholder="ประเภทผลงาน"
            aria-label="ประเภทผลงาน"
            className="w-full rounded-xl border border-border-strong px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* Period */}
          <label className="relative">
            <select
              value={filters.period}
              onChange={(e) => setFilters((old) => ({ ...old, period: e.target.value }))}
              aria-label="ช่วงการใช้งาน"
              className="w-full appearance-none rounded-xl border border-border-strong bg-surface-main px-3 py-2.5 pr-9 text-sm text-on-surface-variant outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-outline" />
          </label>
        </div>
      </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: RESEARCH METRICS (Shown on 'all' and 'research') ─────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'all' || activeTab === 'research') && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-on-background">สถิติและแนวโน้มผลงานวิจัย</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-insight-tint text-primary-container font-semibold">
              Research
            </span>
          </div>

          {/* Research Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="ผลงานทั้งหมด"
              value={overview.totalWorks}
              growth={overview.growth?.works}
              Icon={BookOpen}
              tone="bg-insight-tint text-primary"
            />
            <StatCard
              label="นักศึกษาทั้งหมด"
              value={overview.totalStudents}
              Icon={Users}
              tone="bg-violet-50 text-violet-600"
            />
            <StatCard
              label="สาขาวิชา"
              value={overview.totalDepartments}
              Icon={Building2}
              tone="bg-cyan-50 text-cyan-600"
            />
            <StatCard
              label="การเข้าชมผลงาน"
              value={overview.totalViews}
              growth={overview.growth?.views}
              Icon={Eye}
              tone="bg-amber-50 text-amber-600"
            />
            <StatCard
              label="การค้นหาผลงาน"
              value={overview.totalSearches}
              growth={overview.growth?.searches}
              Icon={Search}
              tone="bg-emerald-50 text-emerald-600"
            />
          </div>

          {/* Research Trends */}
          <Panel
            title="แนวโน้มผลงานวิจัย"
            subtitle="จำนวนผลงานตามปีการเผยแพร่"
            loading={researchState.loading}
            error={r.worksTrend?.error}
            onRetry={loadResearch}
          >
            <LineChart data={trend} lines={[{ key: 'count', label: 'ผลงานวิจัย', color: '#2563eb' }]} />
          </Panel>

          {/* Department + Category breakdown */}
          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            <Panel
              title="ผลงานตามสาขาวิชา"
              subtitle="เรียงจากจำนวนผลงานมากไปน้อย"
              loading={researchState.loading}
              error={r.department?.error}
              onRetry={loadResearch}
            >
              <BarList data={asList(r.department?.data)} />
            </Panel>

            <Panel
              title="หมวดหมู่และประเภทผลงาน"
              loading={researchState.loading}
              error={r.category?.error || r.type?.error}
              onRetry={loadResearch}
            >
              {asList(r.category?.data).length || asList(r.type?.data).length ? (
                <div className="grid min-w-0 gap-7 md:grid-cols-2">
                  <div className="min-w-0">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">หมวดหมู่</p>
                    <BarList data={asList(r.category?.data)} color="bg-violet-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">ประเภท</p>
                    <BarList data={asList(r.type?.data)} color="bg-cyan-500" />
                  </div>
                </div>
              ) : null}
            </Panel>
          </div>

          {/* Keywords & Keyword Trend */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="Keyword ยอดนิยม"
              subtitle="Top 10 จากข้อมูลผลงานและการค้นหา"
              loading={researchState.loading}
              error={r.keywords?.error}
              onRetry={loadResearch}
            >
              <BarList data={keywordData} color="bg-fuchsia-500" />
            </Panel>

            <Panel
              title="แนวโน้ม Keyword"
              subtitle="เลือกคำสำคัญเพื่อดูการเปลี่ยนแปลง"
              loading={keywordTrend.loading}
              error={keywordTrend.error}
              onRetry={() => setKeyword(selectedKeyword)}
            >
              {keywordData.length ? (
                <>
                  <select
                    aria-label="เลือก Keyword"
                    value={selectedKeyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="mb-4 w-full rounded-xl border border-border-strong px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {keywordData.map((item) => (
                      <option key={item.keyword} value={item.keyword}>
                        {item.keyword}
                      </option>
                    ))}
                  </select>
                  <LineChart
                    data={asList(keywordTrend.data)}
                    lines={[{ key: 'count', label: selectedKeyword, color: '#d946ef' }]}
                  />
                </>
              ) : null}
            </Panel>
          </div>

          {/* Usage + Searches */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel
              title="การใช้งานระบบ"
              subtitle="ค้นหา การเข้าชม และดาวน์โหลดตามช่วงเวลา"
              loading={researchState.loading}
              error={r.usage?.error}
              onRetry={loadResearch}
            >
              <LineChart
                data={usage}
                lines={[
                  { key: 'searches', label: 'การค้นหา', color: '#2563eb' },
                  { key: 'views', label: 'การเข้าชม', color: '#f59e0b' },
                  { key: 'downloads', label: 'ดาวน์โหลด', color: '#10b981' },
                ]}
              />
            </Panel>

            <Panel
              title="คำค้นหายอดนิยม"
              loading={researchState.loading}
              error={r.searches?.error}
              onRetry={loadResearch}
            >
              {asList(r.searches?.data).length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[360px] text-left text-sm">
                    <thead className="border-b text-xs text-text-secondary">
                      <tr>
                        <th className="pb-3">อันดับ</th>
                        <th className="pb-3">Keyword</th>
                        <th className="pb-3 text-right">จำนวนครั้ง</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asList(r.searches?.data).slice(0, 10).map((item, index) => (
                        <tr key={item.keyword || index} className="border-b border-border-subtle last:border-0">
                          <td className="py-3 font-bold text-outline">{index + 1}</td>
                          <td className="py-3 font-semibold text-on-background">{item.keyword}</td>
                          <td className="py-3 text-right font-bold text-on-background">{formatNumber(item.count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Panel>
          </div>

          {/* Popular Works */}
          <Panel
            title="ผลงานที่ได้รับความสนใจสูงสุด"
            subtitle="จัดเรียงตามการเข้าชม การดาวน์โหลด หรือกิจกรรมล่าสุด"
            loading={researchState.loading}
            error={r.works?.error}
            onRetry={loadResearch}
          >
            {popularWorks.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b bg-surface-muted text-xs text-text-secondary">
                    <tr>
                      <th className="p-3">ผลงาน</th>
                      <th className="p-3">ผู้จัดทำ / สาขา</th>
                      <th className="p-3">ปี</th>
                      <th className="p-3 text-right">Views</th>
                      <th className="p-3 text-right">Downloads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularWorks.map((work) => (
                      <tr key={work._id} className="border-b border-border-subtle last:border-0">
                        <td className="p-3 font-bold text-primary">
                          <Link to={`/projects/${work._id}`} className="hover:underline">
                            {work.title || 'ไม่ระบุชื่อผลงาน'}
                          </Link>
                        </td>
                        <td className="p-3 text-on-surface-variant">
                          {work.studentName || work.author?.fullName || '-'}
                          <span className="block text-xs text-outline">{work.department || work.major || '-'}</span>
                        </td>
                        <td className="p-3 text-on-surface-variant">{work.academicYear || '-'}</td>
                        <td className="p-3 text-right font-semibold">{formatNumber(work.views)}</td>
                        <td className="p-3 text-right font-semibold">{formatNumber(work.downloads)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </Panel>

          {/* Research Insights */}
          <Panel
            title="Research Insights"
            subtitle="ข้อสรุปที่คำนวณจากข้อมูลจริงของระบบ"
            loading={researchState.loading}
            error={r.insights?.error}
            onRetry={loadResearch}
          >
            {insights.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {insights.map((insight, index) => (
                  <article key={insight.id || index} className="rounded-xl border border-blue-100 bg-insight-tint/50 p-4">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 font-bold text-on-background">{insight.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                      {insight.description || insight.message}
                    </p>
                  </article>
                ))}
              </div>
            ) : null}
          </Panel>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: VISITOR ANALYTICS (Shown on 'all' and 'visitors') ────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {(activeTab === 'all' || activeTab === 'visitors') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-on-background">สถิติผู้เข้าชมเว็บไซต์และทราฟฟิก</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Visitor Traffic
            </span>
          </div>

          {/* Visitor Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="ผู้เข้าชมทั้งหมด (Unique Visitors)"
              value={visitorSummary?.totalVisitors}
              growth={visitorSummary?.visitorChange}
              Icon={Users}
              tone="bg-insight-tint text-primary"
            />
            <StatCard
              label="ผู้เข้าชมวันนี้"
              value={visitorSummary?.todayVisitors}
              Icon={Activity}
              tone="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              label="Page Views ทั้งหมด"
              value={visitorSummary?.totalPageViews}
              growth={visitorSummary?.pageViewChange}
              Icon={Eye}
              tone="bg-amber-50 text-amber-600"
            />
            <StatCard
              label="Sessions ทั้งหมด"
              value={visitorSummary?.totalSessions}
              Icon={Monitor}
              tone="bg-slate-100 text-slate-600"
            />
          </div>

          {/* Visitor Trends Chart */}
          <Panel
            title="แนวโน้มผู้เข้าชม (Visitor Trends)"
            subtitle="สถิติจำนวนผู้เข้าชม Page Views และการมีส่วนร่วมในแต่ละวัน"
            loading={visitorLoading}
            error={visitorError}
            onRetry={loadVisitors}
          >
            {visitorTrends.length > 0 ? (
              <div className="h-72 w-full" role="img" aria-label="กราฟแนวโน้มผู้เข้าชม">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={visitorTrends} margin={{ top: 12, right: 20, bottom: 28, left: 4 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="date"
                      interval="preserveStartEnd"
                      minTickGap={40}
                      height={52}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      width={42}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,.10)' }}
                      labelStyle={{ color: '#334155', fontWeight: 700 }}
                      formatter={(val, name) => [formatNumber(val), name]}
                    />
                    <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="visitors" name="ผู้เข้าชม" stroke="#2563eb" strokeWidth={3} dot={{ r: 3, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="searches" name="การค้นหา" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="workViews" name="เปิดดูผลงาน" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </Panel>

          {/* Top Pages & Device Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Pages */}
            <Panel
              title="หน้าที่เข้าชมมากที่สุด (Top Visited Pages)"
              loading={visitorLoading}
              error={visitorError}
              onRetry={loadVisitors}
            >
              {topPages.length > 0 ? (
                <div className="h-64 w-full" role="img" aria-label="กราฟหน้าที่เข้าชมมากที่สุด">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topPages.slice(0, 8)}
                      layout="vertical"
                      margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
                    >
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={110}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                        formatter={(v) => [formatNumber(v), 'Views']}
                      />
                      <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : null}
            </Panel>

            {/* Devices */}
            <Panel
              title="อุปกรณ์ที่ใช้งาน (Device Breakdown)"
              loading={visitorLoading}
              error={visitorError}
              onRetry={loadVisitors}
            >
              {devices.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="h-44 w-full" role="img" aria-label="กราฟอุปกรณ์ที่ใช้งาน">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={devices}
                          dataKey="count"
                          nameKey="device"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                        >
                          {devices.map((entry) => (
                            <Cell key={entry.device} fill={DEVICE_COLORS[entry.device] || '#94a3b8'} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                          formatter={(v, name) => [formatNumber(v), name]}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    {devices.map((d) => (
                      <div key={d.device} className="flex items-center gap-3">
                        <span
                          className="inline-block h-3 w-3 rounded-full shrink-0"
                          style={{ background: DEVICE_COLORS[d.device] || '#94a3b8' }}
                        />
                        <span className="text-sm font-medium text-on-surface-variant w-20">{d.device}</span>
                        <div className="flex-1 h-2 rounded-full bg-surface-accent">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${d.percentage}%`, background: DEVICE_COLORS[d.device] || '#94a3b8' }}
                          />
                        </div>
                        <span className="text-sm font-bold text-on-background w-12 text-right">
                          {d.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Panel>
          </div>

          {/* Geography placeholder */}
          <Panel title="ภูมิศาสตร์ผู้ใช้งาน (Geography / GeoIP)">
            <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-accent/50 text-center p-4">
              <div>
                <Globe className="h-8 w-8 text-outline mx-auto mb-2" />
                <p className="text-sm font-medium text-on-surface-variant">
                  บันทึกข้อมูลภูมิศาสตร์ระดับประเทศ/ภูมิภาค
                </p>
                <p className="text-xs text-outline mt-0.5">
                  ระบบจัดเก็บและวิเคราะห์ทราฟฟิกของผู้เข้าชมผ่าน Session และ Visitor ID อัตโนมัติ
                </p>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: AUDIT LOGS (Shown on 'audit' and 'all' summary) ──────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div className="space-y-6 pt-2">
          <AuditLogs embedded={true} />
        </div>
      )}

      {activeTab === 'all' && (
        <div className="pt-4">
          <div className="rounded-2xl border border-border-subtle bg-surface-main p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-on-background">ประวัติการทำงานและ Audit Logs</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  ตรวจสอบประวัติการเข้าสู่ระบบของผู้ใช้งาน และบันทึกกิจกรรมการสร้าง แก้ไข ลบ ข้อมูลในระบบ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-accent hover:bg-border-subtle text-on-surface-variant font-semibold text-sm transition shrink-0 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              เปิดดูบันทึก Audit Logs ทั้งหมด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
