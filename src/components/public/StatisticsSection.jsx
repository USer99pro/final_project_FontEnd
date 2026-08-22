/**
 * StatisticsSection — Academic Horizon (DESIGN_Index.md)
 */
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function StatisticsSection({ stats }) {
  const statItems = [
    { label: 'งานวิจัยทั้งหมด', value: stats?.totalProjects ?? 0 },
    { label: 'นักศึกษา', value: stats?.totalStudents ?? 0 },
    { label: 'สาขาวิชา', value: stats?.totalMajors ?? 0 },
    { label: 'ปีการศึกษาล่าสุด', value: stats?.latestYear ?? new Date().getFullYear() + 543 },
  ];

  return (
    <section className="py-12 px-gutter-mobile md:px-gutter-desktop">
      <div className="max-w-container-max mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {statItems.map((item) => (
            <motion.div
              key={item.label}
              variants={cardVariants}
              className="bg-accent-soft p-6 rounded-xl flex flex-col items-center justify-center text-center"
            >
              <div className="font-stats-number text-stats-number text-primary mb-2">
                {item.value.toLocaleString()}
              </div>
              <div className="font-label-sm text-label-sm text-secondary">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
