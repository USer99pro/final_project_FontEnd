/**
 * StatisticsSection Component
 * - 4 stat cards: Total works, Students, Departments, Latest academic year
 * - Rounded, shadow, hover animations
 * - Uses Lucide icons for each stat
 * - Counter animation on scroll
 */
import { motion } from 'framer-motion';
import { FileText, Users, Building2, CalendarDays } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function StatisticsSection({ stats }) {
  const statItems = [
    {
      icon: FileText,
      label: 'ผลงานทั้งหมด',
      value: stats?.totalProjects ?? 0,
      suffix: 'ผลงาน',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'นักศึกษา',
      value: stats?.totalStudents ?? 0,
      suffix: 'คน',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      icon: Building2,
      label: 'สาขาวิชา',
      value: stats?.totalMajors ?? 0,
      suffix: 'สาขา',
      color: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
    },
    {
      icon: CalendarDays,
      label: 'ปีการศึกษาล่าสุด',
      value: stats?.latestYear ?? new Date().getFullYear() + 543,
      suffix: '',
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-2">
            สถิติภาพรวม
          </h2>
          <p className="text-gray-500">ข้อมูลผลงานวิจัยทั้งหมดในระบบ</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.bg} mb-4`}>
                  <Icon className={`w-6 h-6 ${item.text}`} />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-1">
                  {item.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {item.label}
                  {item.suffix && <span className="ml-1">{item.suffix}</span>}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
