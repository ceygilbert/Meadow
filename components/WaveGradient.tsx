import React from 'react';
import { motion } from 'framer-motion';

const WaveGradient: React.FC = () => {
  return (
    <div className="relative w-full h-48 bg-[#050607] overflow-hidden">
      {/* Pink/Purple Glow Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(219,39,119,0.2)_0%,_rgba(124,58,237,0.15)_40%,_transparent_70%)] blur-[80px] opacity-80 translate-y-10" />
      
      {/* Animated Wave SVG */}
      <div className="absolute inset-x-0 bottom-0 h-full opacity-30">
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full"
          initial={{ y: 40 }}
          animate={{ 
            y: [40, 20, 40],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <path
            fill="url(#wave-gradient-pink-purple)"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient-pink-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" /> {/* Purple */}
              <stop offset="50%" stopColor="#db2777" /> {/* Pink */}
              <stop offset="100%" stopColor="#7c3aed" /> {/* Purple */}
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Blue Line from image */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0066FF] shadow-[0_0_25px_rgba(0,102,255,0.8)] z-20" />
      
      {/* Subtle blue glow above the line */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0066FF]/20 to-transparent z-10" />

      {/* Back to Top Button from image */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-0 left-8 md:left-16 z-30 w-12 h-12 bg-[#0066FF] flex items-center justify-center text-white hover:bg-[#0052CC] transition-colors shadow-[0_0_15px_rgba(0,102,255,0.5)]"
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </motion.div>
      </button>
    </div>
  );
};

export default WaveGradient;
