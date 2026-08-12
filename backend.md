# 📋 Frontend Handover Documentation
### Research Project Portal — `final_project_FontEnd`

> อัปเดตล่าสุด: 2026-08-12  
> Backend URL (Production): `https://final-project-backend-knyz.onrender.com`

---

## 1. Tech Stack

| ชื่อ | เวอร์ชัน | ใช้ทำอะไร |
|------|---------|-----------|
| React | 19.2.0 | UI Framework |
| React Router DOM | 7.11.0 | Client-side routing |
| Axios | 1.13.2 | HTTP client (พร้อม JWT interceptor) |
| Tailwind CSS | 4.3.0 | Styling (via Vite plugin) |
| Lucide React | 1.25.0 | Icon library |
| Framer Motion | 12.42.2 | Animation library |
| Vite | 7.2.4 | Build tool / Dev server |

---

## 2. การติดตั้งและรัน

```bash
# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env (copy จาก .env.example)
# แก้ VITE_API_URL ให้ตรง Backend
VITE_API_URL=https://final-project-backend-knyz.onrender.com

# รัน dev server
npm run dev

# Build production
npm run build
```

---

## 3. โครงสร้างโฟลเดอร์

```
src/
├── api/
│   └── client.js              ← Axios instance + JWT auto-refresh interceptor
├── context/
│   └── AuthContext.jsx        ← Global auth state (user, login, logout, register)
├── components/
│   ├── Layout.jsx             ← Navbar + page wrapper (responsive, mobile menu)
│   ├── ProtectedRoute.jsx     ← Route guard ตรวจ role
│   ├── SearchableSelect.jsx   ← Dropdown พร้อม search (ใช้ใน WorkForm)
│   ├── SearchBar.jsx          ← Search input component
│   ├── WorkCard.jsx           ← Card แสดงผลงาน
│   └── public/
│       ├── HeroSection.jsx
│       ├── CategoryGrid.jsx
│       ├── ResearchTable.jsx
│       ├── SearchSection.jsx
│       ├── StatisticsSection.jsx
│       └── PublicFooter.jsx
├── pages/
│   ├── PublicSearch.jsx       ← หน้าหลัก / ค้นหาสาธารณะ (/)
│   ├── PublicDetail.jsx       ← รายละเอียดผลงาน (/projects/:id)
│   ├── Login.jsx              ← หน้าเข้าสู่ระบบ
│   ├── Register.jsx           ← หน้าสมัครสมาชิก
│   ├── OAuthCallback.jsx      ← รับ token จาก Google OAuth callback
│   ├── GraduateDashboard.jsx  ← แดชบอร์ดนักศึกษา (/graduate)
│   ├── MyWorks.jsx            ← รายการผลงานของฉัน (/graduate/works)
│   ├── WorkForm.jsx           ← ฟอร์มสร้าง/แก้ไขผลงาน (ใช้ร่วมกัน)
│   ├── Profile.jsx            ← โปรไฟล์ผู้ใช้ (/graduate/profile)
│   ├── ActivityHistory.jsx    ← ประวัติการดำเนินงาน (/graduate/activity)
│   └── admin/
│       ├── AdminDashboard.jsx         ← /admin
│       ├── UserManagement.jsx         ← /admin/users
│       ├── WorkManagement.jsx         ← /admin/works
│       ├── AdvisorManagement.jsx      ← /admin/advisors
│       ├── CategoryTagManagement.jsx  ← /admin/categories
│       └── AuditLogs.jsx              ← /admin/audit
└── index.css                  ← Global styles + Tailwind
```

---

## 4. Routing (App.jsx)

### Public Routes (ไม่ต้อง login)

| Path | Component | หมายเหตุ |
|------|-----------|---------|
| `/` | `PublicSearch` | หน้าหลัก ค้นหาผลงาน |
| `/projects/:id` | `PublicDetail` | รายละเอียดผลงาน |
| `/login` | `Login` | |
| `/register` | `Register` | |
| `/oauth/callback` | `OAuthCallback` | Google OAuth |
| `/auth/callback` | `OAuthCallback` | alias |
| `/api/auth/google/callback` | `OAuthCallback` | alias |

### Graduate Routes (`role="graduate"`)

| Path | Component | หมายเหตุ |
|------|-----------|---------|
| `/graduate` | `GraduateDashboard` | แดชบอร์ดนักศึกษา |
| `/graduate/works` | `MyWorks` | รายการผลงานของฉัน |
| `/graduate/works/new` | `WorkForm` | สร้างผลงานใหม่ |
| `/graduate/works/:id/edit` | `WorkForm` | แก้ไขผลงาน |
| `/graduate/profile` | `Profile` | โปรไฟล์ |
| `/graduate/activity` | `ActivityHistory` | ประวัติ activity |

### Admin Routes (`role="admin"`)

| Path | Component | หมายเหตุ |
|------|-----------|---------|
| `/admin` | `AdminDashboard` | แดชบอร์ด + export CSV |
| `/admin/users` | `UserManagement` | จัดการผู้ใช้ |
| `/admin/works` | `WorkManagement` | จัดการผลงาน + export CSV |
| `/admin/advisors` | `AdvisorManagement` | จัดการครูที่ปรึกษา |
| `/admin/categories` | `CategoryTagManagement` | จัดการหมวดหมู่/แท็ก |
| `/admin/audit` | `AuditLogs` | ประวัติ audit logs |

> **ProtectedRoute** — ตรวจสอบ `role` ถ้า `role="graduate"` จะให้ทั้ง `graduate` และ `admin` ผ่านได้

---

## 5. AuthContext (`src/context/AuthContext.jsx`)

### Context Value ที่ใช้ได้

```jsx
const { user, loading, login, register, loginWithToken, logout, fetchMe, isAdmin, isGraduate } = useAuth();
```

| Property | Type | คำอธิบาย |
|----------|------|---------|
| `user` | `Object \| null` | ข้อมูล user ที่ login อยู่ |
| `loading` | `boolean` | กำลังโหลด auth state อยู่ |
| `isAdmin` | `boolean` | `user?.role === 'admin'` |
| `isGraduate` | `boolean` | มี user และ role เป็น graduate หรือ user |
| `login(email, password)` | `async fn` | login ด้วย email/password |
| `register(payload)` | `async fn` | สมัครสมาชิก |
| `loginWithToken(token, refreshToken)` | `async fn` | login ด้วย token (ใช้ใน OAuth callback) |
| `logout()` | `fn` | ล้าง token + รีเซ็ต user |
| `fetchMe()` | `async fn` | โหลด user ปัจจุบันจาก `/api/auth/me` |

### User Object

```js
{
  _id: "MongoDB ObjectId",
  fullName: "ชื่อ-นามสกุล",
  email: "user@example.com",
  role: "graduate" | "admin",
  major: "สาขาวิชา",
  studentId: "รหัสนักศึกษา",
  isActive: true,
  createdAt: "ISO date"
}
```

### Token Storage

```js
localStorage.getItem('token')         // access token (JWT, หมดอายุ 15 นาที)
localStorage.getItem('refreshToken')  // refresh token (ต่ออายุ access token อัตโนมัติ)
```

---

## 6. API Client (`src/api/client.js`)

```js
import api from '../api/client';

// ตัวอย่างการใช้
const res = await api.get('/api/public/projects');
const res = await api.post('/api/auth/login', { email, password });
const res = await api.patch('/api/contents/:id', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Features:**
- `baseURL` = `VITE_API_URL` (จาก `.env`)
- ใส่ `Authorization: Bearer <token>` ให้ทุก request อัตโนมัติ
- ถ้าได้ 401 → refresh token อัตโนมัติ → retry request เดิม
- ถ้า refresh ล้มเหลว → ล้าง token ออกจาก localStorage

**Helper Functions ที่ export:**

```js
import { getApiBase, getGoogleAuthUrl, uploadPaper, loadData } from '../api/client';

getApiBase()                  // ได้ VITE_API_URL string
getGoogleAuthUrl()            // URL สำหรับ Google OAuth
uploadPaper(file)             // POST /api/uploads/paper (multipart)
loadData(endpoint)            // GET endpoint generic
```

---

## 7. Backend API Endpoints

> Base URL: `https://final-project-backend-knyz.onrender.com`  
> 🔓 = ไม่ต้อง token | 🔑 = ต้องการ JWT token | 👑 = ต้องการ Admin role

---

### 🔓 Public API

```
GET  /api/public/projects              ← ค้นหาผลงานที่เผยแพร่แล้ว (?q= &category= &major= &year= &tags=)
GET  /api/public/projects/:id          ← รายละเอียดผลงาน (published เท่านั้น)
GET  /api/public/projects/:id/file     ← ดู/ดาวน์โหลด PDF (?download=1 = ดาวน์โหลด)
GET  /api/public/papers                ← รายการผลงานที่มี PDF
GET  /api/public/categories            ← รายการหมวดหมู่ทั้งหมด
GET  /api/public/tags                  ← รายการแท็ก (?department= &category=)
GET  /api/public/advisors              ← รายการอาจารย์ที่ปรึกษา (?q= &limit=)
```

### 🔑 Auth API

```
POST /api/auth/register                ← สมัครสมาชิก { fullName, email, password, studentId, major }
POST /api/auth/login                   ← เข้าสู่ระบบ { email, password }
POST /api/auth/refresh                 ← ต่ออายุ token { refreshToken }
GET  /api/auth/me                      ← ข้อมูล user ที่ login อยู่
GET  /api/auth/google                  ← เริ่ม Google OAuth flow
```

### 🔑 My Content & Activity API

```
GET  /api/me/works                     ← ผลงานของตัวเอง
GET  /api/me/activity                  ← ประวัติ activity ของตัวเอง
```

### 🔑 Contents API (Graduate + Admin)

```
GET    /api/contents                   ← รายการผลงาน (ของตัวเองถ้า graduate, ทั้งหมดถ้า admin)
GET    /api/contents/:id               ← ดูผลงาน (ต้องเป็นเจ้าของหรือ admin)
POST   /api/contents                   ← สร้างผลงานใหม่ (multipart/form-data)
PATCH  /api/contents/:id               ← แก้ไขผลงาน (เจ้าของหรือ admin) (multipart/form-data)
DELETE /api/contents/:id               ← ลบผลงาน (เจ้าของหรือ admin)
```

**FormData fields สำหรับ POST/PATCH contents:**
```
title           (required)
description
abstract
academicYear
major
studentName
category        (ObjectId)
keywords[]      (string array)
participants[]  (User ObjectId array — ต้องอยู่แผนกเดียวกัน)
advisors[]      (Advisor ObjectId array — สูงสุด 3-5 คน)
status          "draft" | "published"
pdf             (File — ต้องมีถ้า status=published)
```

### 🔑 User Management API

```
GET    /api/users                      ← รายการผู้ใช้ (?major=)
POST   /api/users                      ← สร้างผู้ใช้ใหม่ { studentId, fullName, email, password, major, phone, role }
PATCH  /api/users/:id                  ← อัปเดตโปรไฟล์ผู้ใช้ { fullName, studentId, major, phone, password }
DELETE /api/users/:id                  ← ลบผู้ใช้
```

### 👑 Admin API

```
GET    /api/admin/dashboard                ← สถิติภาพรวม
GET    /api/admin/users                    ← รายการผู้ใช้ (?role= &major= &isActive= &search=)
PATCH  /api/admin/users/:id/suspend       ← ระงับผู้ใช้
PATCH  /api/admin/users/:id/activate      ← เปิดใช้งานผู้ใช้
PATCH  /api/admin/users/:id/role          ← เปลี่ยน role { role: "graduate"|"admin" }
POST   /api/admin/users/:id/reset-password ← รีเซ็ตรหัสผ่าน { newPassword }
GET    /api/admin/works                    ← ผลงานทั้งหมดในระบบ
PATCH  /api/admin/works/:id               ← แก้ไขผลงานใดก็ได้ (ไม่จำกัดแผนก)
DELETE /api/admin/works/:id               ← ลบผลงานใดก็ได้
GET    /api/admin/audit-logs              ← Audit logs (?action=)
GET    /api/admin/login-logs              ← Login logs (?limit=)
GET    /api/admin/reports/summary         ← รายงานสรุป (?from= &to=)
GET    /api/admin/reports/export.csv      ← ส่งออก CSV (ต้องใช้ axios blob)
```

### 👑 Advisors API

```
GET    /api/advisors                   ← รายการอาจารย์ (?isActive= &limit=)
POST   /api/advisors                   ← เพิ่มอาจารย์ { prefix, fullName, email, phone, academicPosition, department, expertise, office, isActive }
PATCH  /api/advisors/:id               ← แก้ไขอาจารย์
DELETE /api/advisors/:id               ← ลบอาจารย์
```

### 👑 Categories, Tags & Departments API

```
GET    /api/categories                 ← รายการหมวดหมู่ทั้งหมด
POST   /api/categories                 ← เพิ่มหมวดหมู่ { name }
PATCH  /api/categories/:id             ← แก้ไขหมวดหมู่ { name }
DELETE /api/categories/:id             ← ลบหมวดหมู่

GET    /api/tags                       ← รายการแท็กทั้งหมด
POST   /api/tags                       ← เพิ่มแท็ก { name }
PATCH  /api/tags/:id                   ← แก้ไขแท็ก { name }
DELETE /api/tags/:id                   ← ลบแท็ก

GET    /api/departments                ← รายการสาขาวิชา / แผนกทั้งหมด
POST   /api/departments                ← เพิ่มสาขาวิชา / แผนก { name }
PATCH  /api/departments/:id            ← แก้ไขสาขาวิชา / แผนก { name }
DELETE /api/departments/:id            ← ลบสาขาวิชา / แผนก
```

### 🔑 Uploads API

```
POST   /api/uploads/paper              ← อัปโหลดไฟล์เอกสาร PDF (multipart/form-data: paper, file)
```

---

## 8. Component ที่สำคัญ

### `SearchableSelect` (`src/components/SearchableSelect.jsx`)

Dropdown พร้อมระบบค้นหา ใช้ใน WorkForm สำหรับเลือก participants, advisors, categories

```jsx
<SearchableSelect
  options={[{ value: "id", label: "ชื่อ", sublabel: "รหัสนักศึกษา" }]}
  value={selectedId}
  onChange={(val) => setSelectedId(val)}
  placeholder="— เลือก —"
  searchPlaceholder="พิมพ์ค้นหา..."
  icon={Users}
  disabled={false}
/>
```

### `ProtectedRoute` (`src/components/ProtectedRoute.jsx`)

```jsx
<ProtectedRoute role="graduate">
  <MyPage />
</ProtectedRoute>
```
- ถ้า `loading` → แสดง loading state
- ถ้าไม่มี `user` → redirect ไป `/login`
- ถ้า role ไม่ตรง → redirect ไป `/login`
- `role="graduate"` → ให้ผ่านทั้ง `graduate` และ `admin`

### `Layout` (`src/components/Layout.jsx`)

- Sticky header navbar (desktop + mobile responsive)
- Navbar แสดงเมนูตาม `isAdmin` / `isGraduate`
- Main content มี `pt-16 md:pt-20` (padding ชดเชย fixed header)
- Max width 7xl, padding `px-4 md:px-6`

---

## 9. WorkForm Logic (ส่วนที่สำคัญ)

WorkForm (`src/pages/WorkForm.jsx`) ใช้ทั้งสร้างและแก้ไข:

```jsx
// สร้างใหม่ — id จาก useParams() จะเป็น undefined
// แก้ไข — id จะมีค่า
const { id } = useParams();
const isEdit = Boolean(id);
```

**การ submit (handleAction):**

```js
// สร้างใหม่
POST /api/contents (multipart/form-data)

// แก้ไข — admin
PATCH /api/admin/works/:id (multipart/form-data)   // ★ ลองก่อน (ไม่จำกัดแผนก)
  .catch(() => PATCH /api/contents/:id)             // fallback

// แก้ไข — graduate
PATCH /api/contents/:id (multipart/form-data)
```

**Validation ฝั่ง Frontend:**
- ถ้า status = `published` ต้องมี PDF (ไฟล์ใหม่ หรือมีอยู่แล้ว)
- ไฟล์ต้องเป็น `.pdf` และ `type === 'application/pdf'`
- Advisors สูงสุด 3 คน (advisorLimit = 3)

---

## 10. Export CSV Pattern

> ⚠️ ห้ามใช้ `<a href>` ตรง ๆ เพราะจะไม่ส่ง JWT token → 401 Unauthorized

```jsx
const handleExportCsv = useCallback(async () => {
  setExporting(true);
  try {
    const res = await api.get('/api/admin/reports/export.csv', {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(
      new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert(err.response?.data?.error || 'ไม่สามารถส่งออกข้อมูลได้');
  } finally {
    setExporting(false);
  }
}, []);
```

---

## 11. สิ่งที่เพิ่งแก้ไข / Known Issues

### ✅ แก้แล้ว

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|--------|
| `PATCH /api/admin/works/:id` → 404 | route ไม่มีในระบบ | เพิ่ม route ใหม่ใน `admin.js` |
| `PATCH /api/contents/:id` → 400 (admin edit) | validate department ต่างกัน | ใช้ `/api/admin/works/:id` แทน (ไม่มี dept check) |
| Export CSV → 401 | `<a href>` ไม่ส่ง JWT | เปลี่ยนเป็น `axios blob download` |

### 🔧 ควรทำต่อ / TODO

- [ ] **Pagination ฝั่ง Admin** — WorkManagement และ UserManagement โหลดข้อมูลทั้งหมดมาก่อน ควรใช้ server-side pagination
- [ ] **Search/Filter ใน WorkManagement** — ยังไม่มี filter ตาม status/major/year
- [ ] **Toast Notification** — ปัจจุบันใช้ `alert()` ควรเปลี่ยนเป็น toast library (react-hot-toast หรือ sonner)
- [ ] **PDF Preview** — หน้า PublicDetail ยังไม่มี PDF inline viewer
- [ ] **Error Boundary** — ยังไม่มี global error boundary
- [ ] **Loading Skeleton** — บางหน้าใช้ text "กำลังโหลด..." ควรเปลี่ยนเป็น skeleton UI
- [ ] **Admin Edit Work Route** — WorkManagement.jsx ยังใช้ `/graduate/works/:id/edit` ควรมี route `/admin/works/:id/edit` แยกต่างหาก

---

## 12. Environment Variables

```bash
# .env (สร้างจาก .env.example)
VITE_API_URL=https://final-project-backend-knyz.onrender.com
```

> **หมายเหตุ:** ตัวแปรที่ขึ้นต้นด้วย `VITE_` เท่านั้นที่จะถูก expose ไปยัง browser

---

## 13. Styling Convention

- ใช้ **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- สีหลัก: `blue-600` / `indigo-600` (gradient)
- สี admin: `red-600` / `red-50`
- สีสำเร็จ: `emerald-500` / `emerald-50`
- สี draft: `amber-700` / `amber-50`
- Border radius หลัก: `rounded-xl` / `rounded-2xl`
- Shadow: `shadow-sm` → `shadow-md` on hover
- Transition: `transition-all duration-200`
- Max width content: `max-w-7xl mx-auto`

---

## 14. ไฟล์สำคัญที่ควรอ่านก่อน

1. [`src/App.jsx`](file:///c:/Users/Admin/Documents/final/final_project_FontEnd/src/App.jsx) — ภาพรวม routing ทั้งหมด
2. [`src/api/client.js`](file:///c:/Users/Admin/Documents/final/final_project_FontEnd/src/api/client.js) — HTTP client + token management
3. [`src/context/AuthContext.jsx`](file:///c:/Users/Admin/Documents/final/final_project_FontEnd/src/context/AuthContext.jsx) — Auth state management
4. [`src/components/Layout.jsx`](file:///c:/Users/Admin/Documents/final/final_project_FontEnd/src/components/Layout.jsx) — Navbar + mobile menu
5. [`src/pages/WorkForm.jsx`](file:///c:/Users/Admin/Documents/final/final_project_FontEnd/src/pages/WorkForm.jsx) — ฟอร์มซับซ้อนที่สุดในระบบ
6. [`src/pages/admin/AdminDashboard.jsx`](file:///c:/Users/Admin/Documents/final/final_project_FontEnd/src/pages/admin/AdminDashboard.jsx) — แดชบอร์ด admin
