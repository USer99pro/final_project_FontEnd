# Research Portal (Front_End)

React + Vite — เชื่อมต่อ Back_End ที่ `http://localhost:3500`

## เริ่มต้น

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173`

ตั้งค่า API ใน `.env`:

```
VITE_API_URL=http://localhost:3500
```

## หน้าหลัก

| Path | ผู้ใช้ |
|------|--------|
| `/` | สืบค้นสาธารณะ (นักศึกษาปัจจุบัน) |
| `/projects/:id` | รายละเอียด + บทคัดย่อ + PDF |
| `/register` | สมัครสมาชิก (นักศึกษาจบ) |
| `/login` | เข้าสู่ระบบ |
| `/graduate/*` | จัดการผลงาน / โปรไฟล์ |
| `/admin/*` | ผู้ดูแลระบบ |
