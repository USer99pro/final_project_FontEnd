/**
 * HeroSection Component
 * - Gradient background (blue-700 to cyan-500)
 * - Main heading, description text
 * - CTA button "เริ่มค้นหา"
 * - Decorative illustration on the right
 * - Framer Motion animations
 */
import { motion } from 'framer-motion';
import { Search, BookOpen, GraduationCap, Lightbulb } from 'lucide-react';

export default function HeroSection({ onScrollToSearch }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/20"
            >
              <GraduationCap className="w-4 h-4" />
              <span>วิทยาลัยอาชีวศึกษาอุดรธานี</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              ระบบสืบค้น
              <br />
              <span className="bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
                ผลงานวิจัย
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/90 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              ค้นหาผลงานวิจัยของนักศึกษาระดับปริญญาตรี
              <br className="hidden md:block" />
              สะดวก รวดเร็ว เข้าถึงได้ทุกที่ทุกเวลา
            </p>

            <motion.button
              onClick={onScrollToSearch}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-blue-800 font-extrabold text-lg rounded-2xl shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 cursor-pointer"
            >
              <Search className="w-5 h-5 text-blue-800" />
              <span>เริ่มค้นหา</span>
            </motion.button>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            className="flex-1 hidden lg:flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="relative w-full max-w-md">
              {/* Main illustration card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </motion.div>

                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-4 shadow-xl"
                >
                  <Lightbulb className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [-6, 10, -6] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </motion.div>

                {/* Content inside illustration */}
                <div className="space-y-4">
                  <div className="h-4 bg-white/20 rounded-full w-3/4" />
                  <div className="h-4 bg-white/15 rounded-full w-full" />
                  <div className="h-4 bg-white/20 rounded-full w-5/6" />
                  <div className="h-20 bg-white/10 rounded-2xl mt-6" />
                  <div className="flex gap-3">
                    <div className="h-10 bg-cyan-300/30 rounded-xl flex-1" />
                    <div className="h-10 bg-white/20 rounded-xl flex-1" />
                  </div>
                  <div className="h-4 bg-white/15 rounded-full w-2/3" />
                  <div className="h-4 bg-white/10 rounded-full w-4/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
