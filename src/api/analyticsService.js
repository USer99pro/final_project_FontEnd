import api from './client';
import { getVisitorId, getSessionId, getDeviceInfo } from '../utils/analytics';

const cleanParams = (params = {}) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
);

const get = async (path, params) => (await api.get(path, { params: cleanParams(params) })).data;

// ─── Event Tracking (Public — no auth required) ──────────────────────────────

/**
 * Track an analytics event (PAGE_VIEW, LOGIN, REGISTER).
 * Never throws — analytics failure must not affect UX.
 */
export async function trackAnalyticsEvent(payload) {
  try {
    const { device, browser, os } = getDeviceInfo();
    const body = {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      device,
      browser,
      os,
      referrer: typeof document !== 'undefined' ? document.referrer?.slice(0, 500) || null : null,
      ...payload,
    };
    // Fire-and-forget: do not await in callers for UX
    api.post('/api/analytics', body).catch(() => {});
  } catch {
    // Silently ignore any analytics error
  }
}

// ─── Admin Dashboard APIs ─────────────────────────────────────────────────────

export const analyticsService = {
  // ── Existing work-content analytics (keep unchanged) ──────────────────────
  getOverview: (params) => get('/api/admin/analytics/overview', params),
  getWorksTrend: (params) => get('/api/admin/analytics/works-trend', params),
  getWorksByDepartment: (params) => get('/api/admin/analytics/works-by-department', params),
  getWorksByCategory: (params) => get('/api/admin/analytics/works-by-category', params),
  getWorksByType: (params) => get('/api/admin/analytics/works-by-type', params),
  getPopularKeywords: (params) => get('/api/admin/analytics/popular-keywords', params),
  getKeywordTrend: (params) => get('/api/admin/analytics/keyword-trend', params),
  getPopularSearches: (params) => get('/api/admin/analytics/popular-searches', params),
  getPopularWorks: (params) => get('/api/admin/analytics/popular-works', params),
  getUsageTrend: (params) => get('/api/admin/analytics/usage-trend', params),
  getInsights: (params) => get('/api/admin/analytics/insights', params),
  getDepartments: () => get('/api/departments'),
  getCategories: () => get('/api/categories'),

  // ── New visitor analytics ─────────────────────────────────────────────────
  getAnalyticsSummary: (params) => get('/api/admin/analytics/summary', params),
  getVisitorTrends: (params) => get('/api/admin/analytics/visitor-trends', params),
  getTopPages: (params) => get('/api/admin/analytics/top-pages', params),
  getDeviceAnalytics: (params) => get('/api/admin/analytics/devices', params),
};
