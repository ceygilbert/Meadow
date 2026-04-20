import React from 'react';
import { motion } from 'framer-motion';

const WaveGradient: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-[150] overflow-hidden">
      {/* Pink/Purple Glow Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(219,39,119,0.2)_0%,_rgba(124,58,237,0.15)_40%,_transparent_70%)] blur-[40px] opacity-80 translate-y-5 z-[10]" />
      
      {/* Animated Wave SVGs - Marquee from left to right */}
      <motion.div
        className="absolute bottom-0 flex w-[200vw] h-[150%] opacity-30 z-[15]"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-[100vw] h-full flex-shrink-0 translate-y-8">
          <path
            fill="url(#wave-gradient-pink-purple-1)"
            d="M 0,160 C 240,240 480,80 720,160 C 960,240 1200,80 1440,160 L 1440,320 L 0,320 Z"
          />
          <defs>
            <linearGradient id="wave-gradient-pink-purple-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-[100vw] h-full flex-shrink-0 translate-y-8">
          <path
            fill="url(#wave-gradient-pink-purple-2)"
            d="M 0,160 C 240,240 480,80 720,160 C 960,240 1200,80 1440,160 L 1440,320 L 0,320 Z"
          />
          <defs>
            <linearGradient id="wave-gradient-pink-purple-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Red Line from image */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,1)] z-30" />
      
      {/* Subtle red glow above the line */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FF0000]/30 to-transparent z-20" />
    </div>
  );
};

export default WaveGradient;
