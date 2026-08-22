/**
 * HeroSection — Academic Horizon (DESIGN_Index.md)
 */
import { motion } from 'framer-motion';

export default function HeroSection({ onScrollToSearch }) {
  return (
    <section className="bg-primary text-on-primary py-24 px-gutter-mobile md:px-gutter-desktop">
      <div className="max-w-container-max mx-auto flex flex-col items-center text-center">
        <motion.h1
          className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          คลังข้อมูลงานวิจัยมหาวิทยาลัย
        </motion.h1>

        <motion.p
          className="font-body-lg text-body-lg text-primary-fixed-dim max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          ค้นพบงานวิจัย นวัตกรรม และองค์ความรู้ใหม่ๆ จากผลงานของนักศึกษาและบุคลากรในมหาวิทยาลัย แหล่งรวมทรัพยากรทางวิชาการที่เชื่อถือได้
        </motion.p>

        <motion.button
          onClick={onScrollToSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-primary font-label-sm text-label-sm px-8 py-3 rounded-lg hover:bg-surface-bright transition-colors shadow-sm cursor-pointer"
        >
          เริ่มค้นหางานวิจัย
        </motion.button>
      </div>
    </section>
  );
}
