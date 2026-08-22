/**
 * CategoryGrid — Academic Horizon design
 * Category cards with secondary-fixed icons on surface-container-low
 */
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Database,
  Cloud,
  Cpu,
  Globe,
  Briefcase,
  Palette,
  ShieldCheck,
  Wrench,
  BarChart3,
  BookOpen,
} from 'lucide-react';

const ICON_MAP = {
  'เทคโนโลยีสารสนเทศ': Monitor,
  'คอมพิวเตอร์ธุรกิจ': Briefcase,
  'มัลติมีเดีย': Palette,
  'เครือข่าย': Globe,
  'โมบาย': Smartphone,
  'ฐานข้อมูล': Database,
  'คลาวด์': Cloud,
  'AI': Cpu,
  'ความปลอดภัย': ShieldCheck,
  'ซ่อมบำรุง': Wrench,
  'วิเคราะห์ข้อมูล': BarChart3,
  'วิทยาการคอมพิวเตอร์': Monitor,
  'วิศวกรรมศาสตร์': Wrench,
  'บริหารธุรกิจ': Briefcase,
  default: BookOpen,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function CategoryGrid({ categories = [], onSelectCategory }) {
  const displayCategories = categories.length > 0
    ? categories
    : [
        { _id: '1', name: 'วิทยาการคอมพิวเตอร์', desc: 'AI, Software Engineering, Data Science', count: 0 },
        { _id: '2', name: 'วิศวกรรมศาสตร์', desc: 'Civil, Mechanical, Electrical', count: 0 },
        { _id: '3', name: 'บริหารธุรกิจ', desc: 'Marketing, Finance, Management', count: 0 },
        { _id: '4', name: 'เทคโนโลยีสารสนเทศ', desc: 'Web, Mobile, Cloud Systems', count: 0 },
        { _id: '5', name: 'มัลติมีเดีย', desc: 'Graphic Design, Animation, Media', count: 0 },
        { _id: '6', name: 'เครือข่ายและความปลอดภัย', desc: 'Cybersecurity, IoT, Network', count: 0 },
      ];

  return (
    <section className="py-section-gap px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
      <div className="max-w-container-max mx-auto">
        <h2 className="font-headline-md text-headline-md text-text-primary mb-8">
          สำรวจตามหมวดหมู่
        </h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {displayCategories.map((cat) => {
            const Icon = ICON_MAP[cat.name] || ICON_MAP.default;

            return (
              <motion.div
                key={cat._id || cat.name}
                variants={cardVariants}
                onClick={() => onSelectCategory?.(cat.name)}
                className="bg-surface-container-lowest p-6 rounded-xl border border-surface-border hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Icon className="w-6 h-6 text-primary group-hover:text-on-primary transition-colors" />
                </div>
                <h3 className="font-body-lg text-body-lg font-semibold text-text-primary mb-2">
                  {cat.name}
                </h3>
                <p className="font-body-md text-body-md text-text-secondary">
                  {cat.desc || `${(cat.count || 0).toLocaleString()} ผลงานในระบบ`}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
