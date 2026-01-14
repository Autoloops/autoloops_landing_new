import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_5837fc7d-bec0-4081-8e2e-fc389de70796/artifacts/hsuz0zsw_Gemini_Generated_Image_ksrag6ksrag6ksra.png"
              alt="Autoloops Logo"
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold">
              <span className="text-slate-900">Auto</span>
              <span className="bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent">loops</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">
              Features
            </a>
            <a href="#video" className="text-slate-600 hover:text-teal-600 font-medium transition-colors">
              How it Works
            </a>
            <button
              data-testid="nav-cta-button"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>

          <button
            data-testid="mobile-menu-button"
            className="md:hidden p-2 text-slate-600 hover:text-teal-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;