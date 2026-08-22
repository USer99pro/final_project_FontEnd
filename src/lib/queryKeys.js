/**
 * Domain-Shaped Query Key Factory (JavaScript / JSX App)
 *
 * Implements the hierarchical query key pattern recommended by TanStack Query.
 * This structure enables fine-grained query scoping, granular caching,
 * and targeted cache invalidations without affecting unrelated domains.
 *
 * Hierarchy:
 * - root:       ['domain']
 * - lists:      ['domain', 'list']
 * - list:       ['domain', 'list', params]
 * - details:    ['domain', 'detail']
 * - detail:     ['domain', 'detail', id]
 * - sub-scopes: ['domain', 'detail', id, 'sub-resource']
 */

// 1. Auth & Session Query Keys
export const authKeys = {
  all: ['auth'],
  currentUser: () => [...authKeys.all, 'me'],
  permissions: () => [...authKeys.all, 'permissions'],
};

// 2. Research Works Query Keys
export const worksKeys = {
  all: ['works'],
  lists: () => [...worksKeys.all, 'list'],
  list: (params = {}) => [...worksKeys.lists(), params],
  myWorks: (params = {}) => [...worksKeys.all, 'my-works', params],
  details: () => [...worksKeys.all, 'detail'],
  detail: (id) => [...worksKeys.details(), id],
  stats: () => [...worksKeys.all, 'stats'],
};

// 3. Advisors Query Keys
export const advisorsKeys = {
  all: ['advisors'],
  lists: () => [...advisorsKeys.all, 'list'],
  list: (params = {}) => [...advisorsKeys.lists(), params],
  publicList: (params = {}) => [...advisorsKeys.all, 'public', params],
  details: () => [...advisorsKeys.all, 'detail'],
  detail: (id) => [...advisorsKeys.details(), id],
  byDepartment: (deptId) => [...advisorsKeys.all, 'department', deptId],
};

// 4. Users Query Keys
export const usersKeys = {
  all: ['users'],
  lists: () => [...usersKeys.all, 'list'],
  list: (params = {}) => [...usersKeys.lists(), params],
  details: () => [...usersKeys.all, 'detail'],
  detail: (id) => [...usersKeys.details(), id],
  byMajor: (major) => [...usersKeys.all, 'major', major],
};

// 5. Taxonomy & Metadata Query Keys
export const metadataKeys = {
  all: ['metadata'],
  categories: () => [...metadataKeys.all, 'categories'],
  category: (id) => [...metadataKeys.categories(), id],
  tags: () => [...metadataKeys.all, 'tags'],
  tag: (id) => [...metadataKeys.tags(), id],
  departments: () => [...metadataKeys.all, 'departments'],
  department: (id) => [...metadataKeys.departments(), id],
};

// 6. Analytics & Audit Query Keys
export const analyticsKeys = {
  all: ['analytics'],
  dashboard: () => [...analyticsKeys.all, 'dashboard'],
  summary: (timeRange = {}) => [...analyticsKeys.all, 'summary', timeRange],
  popularWorks: (limit) => [...analyticsKeys.all, 'popular-works', { limit }],
};

export const auditKeys = {
  all: ['audit'],
  logs: (params = {}) => [...auditKeys.all, 'logs', params],
  loginLogs: (limit) => [...auditKeys.all, 'logins', { limit }],
};
