import api from './client';

const cleanParams = (params = {}) => Object.fromEntries(
  Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
);

const get = async (path, params) => (await api.get(path, { params: cleanParams(params) })).data;

export const analyticsService = {
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
};
