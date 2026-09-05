import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export const AdminTablePagination: React.FC<AdminTablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 10, 20, 50],
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeTotalPages = Math.max(1, totalPages);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(safeTotalPages, start + maxButtons - 1);
    
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2 select-none">
      {/* Left: Current Page Label */}
      <div className="text-xs font-medium text-slate-500 order-1 sm:order-none">
        Page {currentPage} of {safeTotalPages} {totalItems > 0 && `(${totalItems} total)`}
      </div>

      {/* Center: Pagination Controls */}
      <div className="flex items-center gap-1.5 order-3 sm:order-none">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="w-8 h-8 rounded-full border border-slate-200/90 hover:border-slate-300 flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:hover:border-slate-200 transition-all"
          title="Previous Page"
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
          disabled={currentPage >= safeTotalPages}
          className="w-8 h-8 rounded-full border border-slate-200/90 hover:border-slate-300 flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:hover:border-slate-200 transition-all"
          title="Next Page"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Right: Page Size Dropdown Pill */}
      <div className="relative order-2 sm:order-none" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
        >
          <span>{pageSize} Data per row</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-slate-200/90 rounded-2xl shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
            {pageSizeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onPageSizeChange(opt);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                  pageSize === opt ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt} Data per row
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
