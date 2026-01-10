
import React from 'react';

export const Logo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = "", size = 'md' }) => {
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.3 : 1;
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            <rect width="100" height="100" rx="28" fill="#E54839" />
            <path d="M30 35L50 55L30 75" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M55 35L75 55L55 75" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          </svg>
        </div>
        <span className="text-2xl font-[900] tracking-tighter text-gray-900 traditional-font leading-none uppercase">
          VIKKX<span className="text-[#E54839]">.ai</span>
        </span>
      </div>
      <div className="flex items-center gap-2 pl-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#E54839] creative-pulse"></div>
        <span className="text-[7.5px] font-black uppercase tracking-[0.45em] text-gray-400">Creative Synthesis Hub</span>
      </div>
    </div>
  );
};
