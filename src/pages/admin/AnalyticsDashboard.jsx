/**
 * AnalyticsDashboard.jsx
 * Admin Analytics Dashboard — Visitor tracking data from Analytics model.
 * Route: /admin/analytics
 * Uses Recharts (project's existing chart library).
 */
import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  Download,
  Eye,
  Globe,
  Monitor,
  RefreshCw,
  Search,
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
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { analyticsService } from '../../api/analyticsService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v) => new Intl.NumberFormat('th-TH').format(Number(v || 0));

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

const PERIOD_OPTIONS = [
  { label: 'วันนี้', value: '1d' },
  { label: '7 วัน', value: '7d' },
  { label: '30 วัน', value: '30d' },
  { label: '90 วัน', value: '90d' },
  { label: '6 เดือน', value: '6m' },
  { label: '1 ปี', value: '1y' },
];

const DEVICE_COLORS = {
  Desktop: '#3b82f6',
  Mobile: '#10b981',
  Tablet: '#f59e0b',
  Unknown: '#94a3b8',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ label, value, change, Icon, color }) {
  const known = change !== null && change !== undefined && Number.isFinite(Number(change));
  const up = Number(change) >= 0;
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-on-surface-variant">{label}</span>
        <span className={`rounded-xl p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-on-background">{fmt(value)}</p>
      {known ? (
        <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-700' : 'text-rose-700'}`}>
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {Math.abs(Number(change)).toFixed(1)}%{' '}
          <span className="font-normal text-text-secondary">จากช่วงก่อนหน้า</span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-outline">ไม่มีข้อมูลเปรียบเทียบ</p>
      )}
    </div>
  );
}

function Panel({ title, children, loading, error, onRetry, className = '' }) {
  return (
    <section className={`w-full rounded-2xl border border-border-subtle bg-surface-main p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-base font-bold text-on-background">{title}</h2>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-5 w-1/3 rounded bg-surface-accent" />
          <div className="h-48 rounded-xl bg-surface-accent" />
        </div>
      ) : error ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center text-sm text-text-secondary">
          <span>ไม่สามารถโหลดข้อมูลได้</span>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1 rounded-lg border border-border-strong px-3 py-1.5 font-semibold text-on-surface-variant hover:bg-surface-accent"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            ลองอีกครั้ง
          </button>
        </div>
      ) : !children ? (
        <div className="flex min-h-40 items-center justify-center text-center text-sm text-outline">
          ยังไม่มีข้อมูลในช่วงเวลาที่เลือก
        </div>
      ) : (
        children
      )}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('30d');
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [devices, setDevices] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    summary: true,
    trends: true,
    topPages: true,
    devices: true,
  });
  const [errors, setErrors] = useState({});

  const setLoading = (key, val) => setLoadingStates((prev) => ({ ...prev, [key]: val }));
  const setError = (key, val) => setErrors((prev) => ({ ...prev, [key]: val }));

  const load = useCallback(async () => {
    const params = { period };

    setLoadingStates({ summary: true, trends: true, topPages: true, devices: true });
    setErrors({});

    const [summaryRes, trendsRes, topPagesRes, devicesRes] = await Promise.allSettled([
      analyticsService.getAnalyticsSummary(params),
      analyticsService.getVisitorTrends(params),
      analyticsService.getTopPages(params),
      analyticsService.getDeviceAnalytics(params),
    ]);

    if (summaryRes.status === 'fulfilled') {
      setSummary(summaryRes.value);
    } else {
      setError('summary', true);
    }
    setLoading('summary', false);

    if (trendsRes.status === 'fulfilled') {
      setTrends(Array.isArray(trendsRes.value) ? trendsRes.value : []);
    } else {
      setError('trends', true);
    }
    setLoading('trends', false);

    if (topPagesRes.status === 'fulfilled') {
      const pages = (Array.isArray(topPagesRes.value) ? topPagesRes.value : []).map((p) => ({
        ...p,
        label: normalizePage(p.page),
      }));
      setTopPages(pages);
    } else {
      setError('topPages', true);
    }
    setLoading('topPages', false);

    if (devicesRes.status === 'fulfilled') {
      setDevices(Array.isArray(devicesRes.value) ? devicesRes.value : []);
    } else {
      setError('devices', true);
    }
    setLoading('devices', false);
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── Render ────────────────────────────────────────────────────────────────

  const summaryCards = [
    {
      label: 'ผู้เข้าชมทั้งหมด',
      value: summary?.totalVisitors,
      change: summary?.visitorChange,
      Icon: Users,
      color: 'bg-insight-tint text-primary',
    },
    {
      label: 'ผู้เข้าชมวันนี้',
      value: summary?.todayVisitors,
      change: null,
      Icon: Activity,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Page Views',
      value: summary?.totalPageViews,
      change: summary?.pageViewChange,
      Icon: Eye,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'การค้นหา',
      value: summary?.totalSearches,
      change: null,
      Icon: Search,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'เปิดดูผลงาน',
      value: summary?.totalWorkViews,
      change: null,
      Icon: Globe,
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      label: 'ดาวน์โหลด',
      value: summary?.totalDownloads,
      change: null,
      Icon: Download,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Sessions',
      value: summary?.totalSessions,
      change: null,
      Icon: Monitor,
      color: 'bg-slate-100 text-slate-600',
    },
  ];

  return (
    <div className="w-full max-w-none space-y-6 pb-8 text-slate-950">
      {/* Header */}
      <header className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-950 via-[#0b2460] to-indigo-950 p-6 text-white shadow-[0_12px_30px_rgba(15,23,42,.18)] md:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface-main/10 px-3 py-1 text-xs font-bold tracking-[.05em] text-blue-100">
            <Activity className="h-3.5 w-3.5" />
            VISITOR ANALYTICS
          </div>
          <h1 className="text-3xl font-bold tracking-[-.02em]">Analytics Dashboard</h1>
          <p className="mt-2 text-sm leading-5 text-blue-100">
            ข้อมูลผู้เข้าชม Page Views, Sessions และพฤติกรรมการใช้งานระบบ
          </p>
        </div>
      </header>

      {/* Period Filter */}
      <section className="rounded-2xl border border-border-subtle bg-surface-main p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-on-surface-variant mr-2">ช่วงเวลา:</span>
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === opt.value
                  ? 'bg-primary-container text-on-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-accent border border-border-subtle'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={load}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant border border-border-strong hover:bg-surface-accent transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            รีเฟรช
          </button>
        </div>
      </section>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* Visitor Trend Chart */}
      <Panel
        title="แนวโน้มผู้เข้าชม"
        loading={loadingStates.trends}
        error={errors.trends}
        onRetry={load}
      >
        {trends.length > 0 ? (
          <div className="h-72 w-full" role="img" aria-label="กราฟแนวโน้มผู้เข้าชม">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 12, right: 20, bottom: 28, left: 4 }}>
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
                  formatter={(value, name) => [fmt(value), name]}
                />
                <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="visitors" name="ผู้เข้าชม" stroke="#2563eb" strokeWidth={3} dot={{ r: 3, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="searches" name="การค้นหา" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="workViews" name="เปิดดูผลงาน" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </Panel>

      {/* Top Pages + Device Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Panel
          title="หน้าที่เข้าชมมากที่สุด"
          loading={loadingStates.topPages}
          error={errors.topPages}
          onRetry={load}
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
                    width={100}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                    formatter={(v) => [fmt(v), 'Views']}
                  />
                  <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </Panel>

        {/* Device Breakdown */}
        <Panel
          title="อุปกรณ์ที่ใช้งาน"
          loading={loadingStates.devices}
          error={errors.devices}
          onRetry={load}
        >
          {devices.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="h-48 w-full" role="img" aria-label="กราฟอุปกรณ์ที่ใช้งาน">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={devices}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {devices.map((entry) => (
                        <Cell key={entry.device} fill={DEVICE_COLORS[entry.device] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                      formatter={(v, name) => [fmt(v), name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Device percentage table */}
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
      <Panel title="ภูมิศาสตร์ (Geography)">
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-accent/50 text-center">
          <div>
            <Globe className="h-10 w-10 text-outline mx-auto mb-3" />
            <p className="text-sm font-medium text-on-surface-variant">
              ยังไม่มีข้อมูลภูมิศาสตร์เพียงพอ
            </p>
            <p className="text-xs text-outline mt-1">
              ข้อมูล Country/Region จะแสดงเมื่อมีการตั้งค่า GeoIP
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
