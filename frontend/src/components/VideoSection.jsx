import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="video" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm text-teal-600 font-semibold uppercase tracking-widest mb-4 block">
            See it in action
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Scale Your Meta Ads on{' '}
            <span className="bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent">
              Autopilot
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Watch how Autoloops agents analyze, optimize, and scale your campaigns continuously—delivering results while you focus on strategy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-slate-900">
            {/* Video Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
              {!isPlaying && (
                <motion.button
                  data-testid="video-play-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center z-10 group"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-300">
                    <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                  </div>
                </motion.button>
              )}
              
              {/* Placeholder for actual video */}
              {isPlaying ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-lg mb-4">Video player will be embedded here</p>
                    <p className="text-slate-400 text-sm">YouTube/Vimeo embed placeholder</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 opacity-50">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85"
                    alt="Dashboard Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent mb-2">
              47%
            </div>
            <div className="text-slate-600 font-medium">Average ROAS increase in first month</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-slate-600 font-medium">Autonomous optimization running</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent mb-2">
              5 min
            </div>
            <div className="text-slate-600 font-medium">Setup time, no code required</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;