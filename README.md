# 🎓 Research Portal (Frontend)

ระบบคลังผลงานวิชาการ งานวิจัย และปริญญานิพนธ์ (Research & Academic Work Management Portal) พัฒนาขึ้นสำหรับสืบค้น จัดเก็บ และบริหารจัดการผลงานทางวิชาการของนักศึกษาและบัณฑิต

---

## 📌 คุณสมบัติเด่น (Key Features)

### 🔍 1. ผู้ใช้งานทั่วไป / นักศึกษาปัจจุบัน (Public & Current Students)
- **สืบค้นผลงานวิชาการ (Public Search):** ค้นหาผลงานตามชื่อเรื่อง, คีย์เวิร์ด, หมวดหมู่, ปีการศึกษา หรือผู้จัดทำ
- **ดูรายละเอียดผลงาน (Public Detail):** แสดงบทคัดย่อ, รายชื่อผู้จัดทำ, อาจารย์ที่ปรึกษา, หมวดหมู่, แท็ก และดาวน์โหลด/ดูไฟล์ PDF

### 🎓 2. บัณฑิต / ศิษย์เก่า (Graduate Users)
- **แดชบอร์ดนักศึกษา (Graduate Dashboard):** แสดงภาพรวมผลงาน สถิติการเข้าดู และสถานะการอนุมัติผลงาน
- **จัดการผลงาน (My Works & Work Form):** เพิ่ม แก้ไข และนำเสนอผลงานวิชาการของตนเอง พร้อมอัปโหลดไฟล์บทคัดย่อ/เอกสารประกอบ
- **จัดการโปรไฟล์ (Profile):** แก้ไขข้อมูลส่วนตัว ประวัติการศึกษา และข้อมูลการติดต่อ
- **ประวัติกิจกรรม (Activity History):** ตรวจสอบประวัติการใช้งานและการทำรายการในระบบ

### 🛡️ 3. ผู้ดูแลระบบ (Admin Management)
- **แผงควบคุมระบบ (Admin Dashboard):** แสดงสถิติต่างๆ ในระบบ เช่น จำนวนผู้ใช้งาน ผลงานทั้งหมด และผลงานรอการอนุมัติ
- **อนุมัติและจัดการผลงาน (Work Management):** ตรวจสอบ อนุมัติ ปฏิเสธ หรือแก้ไขสถานะผลงานวิชาการ
- **จัดการผู้ใช้งาน (User Management):** บริหารจัดการบัญชีผู้ใช้งาน กำหนดสิทธิ์ (Role) และเปิด/ปิดใช้งานบัญชี
- **จัดการหมวดหมู่และแท็ก (Category & Tag Management):** เพิ่ม ลบ และแก้ไขหมวดหมู่งานวิจัยและแท็กค้นหา
- **บันทึกประวัติระบบ (Audit Logs):** ตรวจสอบ Log การทำงานและการเปลี่ยนแปลงต่างๆ ภายในระบบ

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Core Library:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

---

## 📂 โครงสร้างโฟลเดอร์ (Project Structure)

```text
src/
├── api/                  # Axios Client และ API Interceptors
├── components/           # Components ที่ใช้ร่วมกัน (Layout, Navbar, ProtectedRoute ฯลฯ)
├── context/              # React Context (AuthContext ฯลฯ)
├── pages/                # หน้าเว็บหลัก
│   ├── admin/            # หน้าสำหรับผู้ดูแลระบบ (Dashboard, Users, Works, Audit Logs)
│   ├── ActivityHistory.jsx
│   ├── GraduateDashboard.jsx
│   ├── Login.jsx
│   ├── MyWorks.jsx
│   ├── Profile.jsx
│   ├── PublicDetail.jsx
│   ├── PublicSearch.jsx
│   ├── Register.jsx
│   └── WorkForm.jsx
├── App.jsx               # Main Router Configuration
├── index.css             # Tailwind & Global Styles
└── main.jsx              # Application Entry Point
```

---

## 🗺️ เส้นทางใช้งานระบบ (Route Overview)

| Path | สิทธิ์การเข้าถึง | รายละเอียดหน้า |
| :--- | :--- | :--- |
| `/` | สาธารณะ | หน้าค้นหาและสืบค้นผลงานวิชาการ |
| `/projects/:id` | สาธารณะ | หน้าแสดงรายละเอียดและดาวน์โหลดผลงาน |
| `/login` | สาธารณะ | หน้าเข้าสู่ระบบ |
| `/register` | สาธารณะ | หน้าลงทะเบียนบัณฑิต |
| `/graduate` | บัณฑิต (`graduate`) | หน้าแดชบอร์ดบัณฑิต |
| `/graduate/works` | บัณฑิต (`graduate`) | รายการผลงานทั้งหมดของฉัน |
| `/graduate/works/new` | บัณฑิต (`graduate`) | แบบฟอร์มเพิ่มผลงานใหม่ |
| `/graduate/works/:id/edit` | บัณฑิต (`graduate`) | แบบฟอร์มแก้ไขผลงาน |
| `/graduate/profile` | บัณฑิต (`graduate`) | จัดการข้อมูลโปรไฟล์ส่วนตัว |
| `/graduate/activity` | บัณฑิต (`graduate`) | ประวัติการใช้งาน |
| `/admin` | ผู้ดูแลระบบ (`admin`) | แดชบอร์ดผู้ดูแลระบบ |
| `/admin/users` | ผู้ดูแลระบบ (`admin`) | จัดการสิทธิ์และข้อมูลผู้ใช้งาน |
| `/admin/works` | ผู้ดูแลระบบ (`admin`) | ตรวจสอบและอนุมัติผลงาน |
| `/admin/categories` | ผู้ดูแลระบบ (`admin`) | จัดการหมวดหมู่และแท็ก |
| `/admin/logs` | ผู้ดูแลระบบ (`admin`) | ตรวจสอบประวัติการทำงานของระบบ (Audit Logs) |

---

## 🚀 การติดตั้งและการใช้งาน (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18.0.0 ขึ้นไป)
- `npm` หรือ `yarn` / `pnpm`

### 2. ตั้งค่าไฟล์ Environment Variables
สร้างไฟล์ `.env` ที่ root directory ของโครงการ:

```env
VITE_API_URL=http://localhost:3500
```

### 3. ติดตั้ง Dependencies

```bash
npm install
```

### 4. รันโปรเจกต์ในโหมดพัฒนา (Development Server)

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: [http://localhost:5173](http://localhost:5173)

---

## 📦 คำสั่งสคริปต์ (Available Scripts)

- `npm run dev` : เริ่มรัน Development Server (Vite)
- `npm run build` : สร้าง Bundle สำหรับนำไป Production (ไฟล์จะอยู่ที่โฟลเดอร์ `dist`)
- `npm run preview` : ทดสอบรัน Production Bundle ที่สร้างไว้ในเครื่องท้องถิ่น

---

📄 **License:** Private Academic Project
