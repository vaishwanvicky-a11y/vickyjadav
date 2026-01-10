
import React from 'react';
import { Mode } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  activeMode: Mode;
  setActiveMode: (mode: Mode) => void;
  credits: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, setActiveMode, credits }) => {
  const navItems = [
    { mode: Mode.HOME, label: 'Home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { mode: Mode.IMAGE, label: 'Vision', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { mode: Mode.ANIME, label: 'Anime', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { mode: Mode.WISH, label: 'Wish', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
      </svg>
    )}
  ];

  return (
    <>
      <nav className="hidden md:flex w-72 bg-white/95 border-r border-[#E54839]/5 p-8 flex-col gap-8 shadow-2xl z-30 sticky top-0 h-screen">
        <div className="py-4">
          <Logo size="md" />
        </div>
        <div className="flex flex-col gap-3">
          {navItems.map(item => (
            <button
              key={item.mode}
              onClick={() => setActiveMode(item.mode)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeMode === item.mode ? 'bg-[#E54839] text-white' : 'text-gray-500 hover:bg-[#E54839]/5'
              }`}
            >
              {item.icon}
              <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto p-6 bg-[#E54839]/5 rounded-3xl space-y-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance</span>
            <p className="text-xl font-black text-gray-900 traditional-font">✦ {credits}</p>
        </div>
      </nav>

      {/* Mobile Nav Optimized for Android/iOS */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-black/90 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-around px-4 z-50 border border-white/10 shadow-2xl">
        {navItems.map(item => (
          <button key={item.mode} onClick={() => setActiveMode(item.mode)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeMode === item.mode ? 'bg-[#E54839] text-white scale-110' : 'text-gray-400'}`}>
            {item.icon}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
