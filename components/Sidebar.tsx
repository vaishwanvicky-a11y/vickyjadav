
import React from 'react';
import { Mode } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  activeMode: Mode;
  setActiveMode: (mode: Mode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMode, setActiveMode }) => {
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
    { mode: Mode.REALISTIC, label: 'Realism', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { mode: Mode.THUMBNAIL, label: 'Media', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
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
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-72 bg-white/95 border-r border-[#E54839]/5 p-8 flex-col gap-8 shadow-2xl z-30 sticky top-0 h-screen">
        <div className="py-4">
          <Logo size="md" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="mb-2 px-4">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Creative Hub</span>
          </div>
          
          {navItems.map(item => (
            <button
              key={item.mode}
              onClick={() => setActiveMode(item.mode)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group ${
                activeMode === item.mode
                  ? 'bg-[#E54839] text-white shadow-2xl shadow-[#E54839]/30 scale-[1.02]'
                  : 'hover:bg-[#E54839]/5 text-gray-500'
              }`}
            >
              <div className={activeMode === item.mode ? 'text-white' : 'text-gray-400 group-hover:text-[#E54839]'}>
                {item.icon}
              </div>
              <span className="font-black text-xs uppercase tracking-widest">{item.label} Studio</span>
              {activeMode === item.mode && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-6">
          <a 
            href="https://www.instagram.com/vikkx.ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#E54839]/20 transition-all"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-[#E54839] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Follow ViKkx</span>
          </a>
          <div className="p-6 bg-gradient-to-br from-[#E54839]/5 to-transparent rounded-[2.5rem] border border-[#E54839]/10">
            <p className="text-[10px] text-[#E54839] font-black uppercase tracking-[0.4em] mb-3">v1.0 Ready</p>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">Premium Synthesis Engine Active</p>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - High End App Feel */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-18 bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-around px-4 z-50">
        {navItems.map(item => (
          <button
            key={item.mode}
            onClick={() => setActiveMode(item.mode)}
            className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${
              activeMode === item.mode
                ? 'text-[#E54839] scale-110'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {item.icon}
            <span className={`text-[7px] font-black uppercase tracking-tighter mt-1 ${activeMode === item.mode ? 'opacity-100' : 'opacity-0'}`}>
              {item.label}
            </span>
            {activeMode === item.mode && (
              <div className="absolute -top-1 w-1 h-1 bg-[#E54839] rounded-full"></div>
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
