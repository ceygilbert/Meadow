import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  currentPage?: string;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPage, className }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Link 
        to="/customised" 
        className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group"
      >
        <Home size={18} className="text-slate-400 group-hover:text-white transition-colors" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Home</span>
      </Link>
      
      {currentPage && (
        <div className="flex items-center gap-4">
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500">
            {currentPage}
          </span>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;
