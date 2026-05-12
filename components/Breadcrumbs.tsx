import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, currentPage, className }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Link 
        to="/" 
        className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all group shrink-0"
      >
        <Home size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Home</span>
      </Link>
      
      {items && items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-px h-4 bg-slate-200 shrink-0" />
          {item.path ? (
            <Link 
              to={item.path}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}

      {!items && currentPage && (
        <div className="flex items-center gap-4">
          <div className="w-px h-4 bg-slate-200 shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 whitespace-nowrap">
            {currentPage}
          </span>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;
