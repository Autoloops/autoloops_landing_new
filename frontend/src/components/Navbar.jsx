import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
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
                src="/assets/images/logo.png"
                alt="Autoloops Logo"
                className="h-12 w-auto"
              />
              <span className="text-2xl font-bold">
                <span className="text-slate-900">Auto</span>
                <span className="bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent">loops</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="https://calendly.com/anirudh-autoloops/30min"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="nav-cta-button"
                className="h-12 px-8 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Contact Us
              </a>
            </div>

            <button
              onClick={toggleMobileMenu}
              data-testid="mobile-menu-button"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-3 text-slate-600 hover:text-teal-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <a
              href="https://calendly.com/anirudh-autoloops/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="block w-full h-14 px-8 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[44px]"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      )}

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;