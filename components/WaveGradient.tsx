import React from 'react';
import { motion } from 'framer-motion';

const WaveGradient: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-[150] overflow-hidden">
      {/* Pink/Purple Glow Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(219,39,119,0.2)_0%,_rgba(124,58,237,0.15)_40%,_transparent_70%)] blur-[60px] opacity-80 translate-y-10 z-[10]" />
      
      {/* Animated Wave SVG */}
      <div className="absolute inset-x-0 bottom-0 h-full opacity-30 z-[15]">
        <motion.svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full"
          initial={{ y: 60 }}
          animate={{ 
            y: [60, 40, 60],
            transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <path
            fill="url(#wave-gradient-pink-purple-fixed)"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="wave-gradient-pink-purple-fixed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Red Line from image */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF0000] shadow-[0_0_30px_rgba(255,0,0,1)] z-30" />
      
      {/* Subtle red glow above the line */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FF0000]/40 to-transparent z-20" />
    </div>
  );
};

export default WaveGradient;
