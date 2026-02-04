import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-900 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

          <div className="text-slate-300 text-lg leading-relaxed space-y-8">
            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Service</h2>
              <p>
                Autoloops provides AI-powered agents that connect to your Meta ad accounts to analyze
                creative performance, identify optimization opportunities, and help scale your winning
                campaigns. Our agents work 24/7 to monitor your ads and surface actionable insights
                that humans simply can't find manually.
              </p>
            </section>

            {/* What We Do */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Do For You</h2>
              <ul className="space-y-3 list-disc list-inside text-slate-400">
                <li>Analyze your ad creatives to identify top performers</li>
                <li>Detect creative fatigue before it impacts your ROAS</li>
                <li>Generate weekly reports on campaign performance</li>
                <li>Provide proactive suggestions to optimize your ad spend</li>
                <li>Help you scale winning ads and pause underperformers</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Responsibilities</h2>
              <p className="mb-4">By using Autoloops, you agree to:</p>
              <ul className="space-y-3 list-disc list-inside text-slate-400">
                <li>Provide accurate Meta Business account access</li>
                <li>Maintain authorization for the connected ad accounts</li>
                <li>Review and approve optimization suggestions before major changes</li>
                <li>Comply with Meta's advertising policies</li>
              </ul>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p>
                We strive to keep Autoloops running 24/7 so your campaigns are always monitored.
                While we aim for maximum uptime, we may occasionally need to perform maintenance
                or updates to improve the service.
              </p>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitations</h2>
              <p>
                Autoloops provides optimization suggestions based on data analysis. While our AI
                agents are designed to improve ad performance, results may vary based on your
                industry, creative quality, and market conditions. We recommend reviewing
                significant changes before implementation.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                Questions about these terms? Reach out to us at{' '}
                <a
                  href="mailto:anirudh@autoloops.ai"
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  anirudh@autoloops.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
