
import React from 'react';
import { Logo } from './Logo';
import { Mode } from '../types';

interface HeaderProps {
  activeMode: Mode;
  onBack: () => void;
  credits: number;
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeMode, onBack, credits, userName, onLogout }) => {
  const handleSupport = () => {
    window.open('https://www.instagram.com/vikkx.ai/', '_blank');
  };

  return (
    <header className="px-4 md:px-10 py-4 md:py-6 flex items-center justify-between glass sticky top-0 z-40 border-b border-[#E54839]/5 min-h-[80px]">
      <div className="flex items-center gap-4">
        {activeMode !== Mode.HOME && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 md:px-5 py-2.5 bg-gray-100/80 hover:bg-gray-200 text-gray-900 rounded-xl md:rounded-2xl transition-all animate-in group active:scale-95"
          >
            <svg className="w-4 h-4 text-[#E54839] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
        )}
        <Logo size="sm" className="scale-90 md:scale-100" />
      </div>

      <div className="flex items-center gap-3">
        {/* Credits Chip */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E54839]/10 rounded-full shadow-sm">
          <span className="text-[#E54839] text-sm animate-pulse">✦</span>
          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{credits} <span className="text-gray-400">Credits</span></span>
        </div>

        {/* User Info */}
        <div className="hidden md:flex items-center gap-2 pl-2">
          <button 
            onClick={onLogout}
            title={`Logged in as ${userName}`}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-black border-2 border-white shadow-lg hover:bg-red-600 transition-colors uppercase"
          >
            {userName.charAt(0)}
          </button>
        </div>

        <button 
          onClick={handleSupport}
          className="btn-follow-pulse relative group px-4 md:px-8 py-3 md:py-4 bg-gray-900 text-white rounded-2xl md:rounded-[2rem] font-black text-[9px] md:text-xs uppercase tracking-[0.25em] transition-all hover:bg-black hover:-translate-y-0.5 shadow-2xl active:scale-95 overflow-hidden flex items-center gap-2 md:gap-3 border border-white/10"
        >
          <span className="relative z-10 hidden sm:inline">Support</span>
          <span className="relative z-10 sm:hidden">Help</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
