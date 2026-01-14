import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, LineChart, Layers, Zap, RefreshCw } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_20px_40px_-12px_rgba(6,81,237,0.2)] transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'Intelligent Creative Analysis',
      description: 'AI-powered agents automatically analyze every creative element, tracking performance across all campaigns. Identify winning patterns before your competitors do.',
    },
    {
      icon: Target,
      title: 'Precision Audience Targeting',
      description: 'Connect your CRM, analytics, and ad platform data to discover high-value audience segments. Our agents optimize targeting to maximize ROAS automatically.',
    },
    {
      icon: LineChart,
      title: 'Real-Time Performance Optimization',
      description: 'Continuous monitoring and adjustment of bids, budgets, and placements. Our agents work 24/7 to ensure every dollar drives maximum return.',
    },
    {
      icon: Layers,
      title: 'Unified Data Dashboard',
      description: 'See all your Meta ad data in one beautiful interface. No more spreadsheets or platform-hopping. Get instant insights on what matters most.',
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Deployment',
      description: 'Connect your Meta Ads account in minutes. No code, no complex setup. Start seeing optimizations within hours, not weeks.',
    },
    {
      icon: RefreshCw,
      title: 'Automated Creative Refresh',
      description: 'Detect creative fatigue early and automatically pause underperforming ads. Reallocate budget to winning creatives in real-time.',
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm text-teal-600 font-semibold uppercase tracking-widest mb-4 block">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent">
              Dominate Meta Ads
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Autoloops combines cutting-edge AI with deep Meta advertising expertise to give you an unfair advantage.
          </p>
        </motion.div>

        {/* Feature Grid - 6 tiles in 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Scale Your Meta Ads?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of growth teams using AI to achieve breakthrough performance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                data-testid="features-cta-button"
                className="h-14 px-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </button>
              <button
                data-testid="features-demo-button"
                className="h-14 px-10 rounded-full bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-semibold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;