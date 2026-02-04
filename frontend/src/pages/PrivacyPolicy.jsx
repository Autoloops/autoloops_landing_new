import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-900 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="text-slate-300 text-lg leading-relaxed space-y-8">
            {/* Data Storage Section */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Storage</h2>
              <p>
                All ad data is processed and stored in memory only. We do not persistently store
                your ad account data, campaign information, or performance metrics on our servers.
              </p>
            </section>

            {/* Meta API Permissions Section */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Meta API Permissions</h2>
              <p className="mb-6">
                Autoloops requests the following permissions to provide our optimization services:
              </p>

              <div className="space-y-6">
                {/* ads_read */}
                <div className="border-l-2 border-teal-500 pl-4">
                  <h3 className="text-xl font-medium text-white mb-2">ads_read</h3>
                  <p className="text-slate-400 mb-2">
                    <span className="text-slate-300 font-medium">What it accesses:</span> Ad account data,
                    campaigns, ad sets, ads, and performance insights.
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300 font-medium">Why we need it:</span> To analyze your
                    creative performance, identify winning ads, detect creative fatigue, and generate
                    weekly campaign reports.
                  </p>
                </div>

                {/* ads_management */}
                <div className="border-l-2 border-teal-500 pl-4">
                  <h3 className="text-xl font-medium text-white mb-2">ads_management</h3>
                  <p className="text-slate-400 mb-2">
                    <span className="text-slate-300 font-medium">What it accesses:</span> Ability to create,
                    edit, and manage ads, campaigns, and ad sets.
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300 font-medium">Why we need it:</span> To implement
                    optimization suggestions like pausing fatigued creatives and scaling winning ads.
                  </p>
                </div>

                {/* business_management */}
                <div className="border-l-2 border-teal-500 pl-4">
                  <h3 className="text-xl font-medium text-white mb-2">business_management</h3>
                  <p className="text-slate-400 mb-2">
                    <span className="text-slate-300 font-medium">What it accesses:</span> Business assets
                    and settings.
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300 font-medium">Why we need it:</span> To access ad
                    accounts associated with your business and provide cross-account insights.
                  </p>
                </div>

                {/* pages_read_engagement */}
                <div className="border-l-2 border-teal-500 pl-4">
                  <h3 className="text-xl font-medium text-white mb-2">pages_read_engagement</h3>
                  <p className="text-slate-400 mb-2">
                    <span className="text-slate-300 font-medium">What it accesses:</span> Page content
                    and engagement metrics.
                  </p>
                  <p className="text-slate-400">
                    <span className="text-slate-300 font-medium">Why we need it:</span> To correlate ad
                    performance with organic page engagement for holistic optimization.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
