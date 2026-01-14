import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-teal-50"></div>
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-200/30 to-sky-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-teal-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-20 relative">
        <div className="flex flex-col items-center text-center relative">
          {/* Three Cards Layout - Staggered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 relative w-full max-w-6xl"
          >
            <div className="flex items-center justify-center gap-6 relative">
              {/* Left Card - Slightly higher and smaller */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative hidden lg:block -mt-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-2xl blur-2xl"></div>
                <img
                  src="https://customer-assets.emergentagent.com/job_autoloop-landing/artifacts/ipiktsia_Frame%201.png"
                  alt="Winning Creative Ideas"
                  className="relative w-64 h-auto rounded-2xl shadow-xl"
                />
              </motion.div>

              {/* Center Card - Largest */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-blue-500/30 rounded-2xl blur-3xl"></div>
                <img
                  src="https://customer-assets.emergentagent.com/job_autoloop-landing/artifacts/jw53jjh1_Card.png"
                  alt="Proactive Suggestions"
                  className="relative w-full md:w-[32rem] h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>

              {/* Right Card - Slightly lower and smaller */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative hidden lg:block mt-8"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-blue-400/20 to-teal-400/20 rounded-2xl blur-2xl"></div>
                <img
                  src="https://customer-assets.emergentagent.com/job_autoloop-landing/artifacts/by5caqzf_Frame%202.png"
                  alt="Weekly Reports"
                  className="relative w-64 h-auto rounded-2xl shadow-xl"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 max-w-5xl"
          >
            AI Agents that{' '}
            <span className="bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent">
              scale your Meta ads
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl leading-relaxed text-slate-600 mb-12 max-w-3xl font-medium"
          >
            Autoloops connects your ad platform, analytics, and creative data to uncover optimization opportunities humans simply can't find.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              data-testid="hero-cta-button"
              className="h-14 px-10 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </button>
            <button
              data-testid="hero-demo-button"
              className="h-14 px-10 rounded-full bg-white text-slate-900 border-2 border-slate-200 font-semibold text-lg hover:bg-slate-50 hover:border-teal-200 transition-all duration-200"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;