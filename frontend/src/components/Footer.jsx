import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="mb-12">
          {/* Brand */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/images/logo-footer.png"
                alt="Autoloops Logo"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold">Autoloops</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              AI agents that scale your Meta ads on autopilot. Built for growth teams who demand results.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/auto-loops"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Autoloops on LinkedIn"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors"
                data-testid="footer-linkedin-link"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:anirudh@autoloops.ai"
                aria-label="Contact Autoloops via email"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors"
                data-testid="footer-email-link"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Autoloops. All rights reserved.
          </p>
          <div className="flex gap-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;