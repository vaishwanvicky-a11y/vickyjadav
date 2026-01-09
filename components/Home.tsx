
import React from 'react';
import { Mode } from '../types';
import { Logo } from './Logo';

interface HomeProps {
  onStartMode: (mode: Mode) => void;
}

const Home: React.FC<HomeProps> = ({ onStartMode }) => {
  const categories = [
    { mode: Mode.REALISTIC, title: 'Super Realism', desc: 'Flawless human portraits and lifelike reality.', icon: '👤', color: 'from-blue-500/10 to-transparent' },
    { mode: Mode.THUMBNAIL, title: 'Thumbnail Pro', desc: 'YouTube ready in Telugu, English, & Hindi.', icon: '🎬', color: 'from-red-500/10 to-transparent' },
    { mode: Mode.ANIME, title: 'Anime Studio', desc: 'Vibrant manga art & full page comic creator.', icon: '✨', color: 'from-purple-500/10 to-transparent' },
    { mode: Mode.IMAGE, title: 'Vision Engine', desc: 'Artistic fusion and traditional heritage art.', icon: '🖼️', color: 'from-amber-500/10 to-transparent' },
    { mode: Mode.WISH, title: 'Infinite Wish', desc: 'The Ultimate Creative Sandbox. Your Turn. Your Vision.', icon: '🌟', color: 'from-[#E54839]/10 to-transparent' }
  ];

  return (
    <div className="space-y-16 md:space-y-24 animate-in pb-32">
      <section className="text-center space-y-10 md:space-y-16 py-12 md:py-24 relative px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-b from-[#E54839]/10 to-transparent rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="flex justify-center">
          <Logo size="lg" className="md:scale-125 scale-100" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-9xl font-[900] traditional-font text-gray-900 tracking-tighter leading-[0.95] drop-shadow-sm">
            Professional <span className="text-[#E54839]">Synthesis</span> Hub
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto px-4 italic">
            "Where traditional precision meets high-end neural artistry."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-5 md:gap-10 pt-4">
           <button 
             onClick={() => onStartMode(Mode.REALISTIC)}
             className="group px-12 py-6 bg-[#E54839] text-white rounded-[2rem] md:rounded-[3rem] font-black text-xs md:text-sm uppercase tracking-[0.25em] shadow-2xl shadow-[#E54839]/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4"
           >
             Launch Studio
             <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
           </button>
           <button 
             onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
             className="px-12 py-6 bg-white text-gray-900 border-2 border-gray-100 rounded-[2rem] md:rounded-[3rem] font-black text-xs md:text-sm uppercase tracking-[0.25em] hover:border-[#E54839]/30 hover:bg-gray-50 transition-all shadow-xl"
           >
             Browse Engines
           </button>
        </div>
      </section>

      <section id="capabilities" className="space-y-12 md:space-y-20 scroll-mt-24 px-6 md:px-0">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-gray-100 pb-10">
          <div className="flex items-center gap-6">
            <div className="h-0.5 w-16 bg-[#E54839]"></div>
            <h2 className="text-4xl md:text-5xl font-black traditional-font text-gray-900 tracking-tight">The Studios</h2>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em]">Select Synthesis Engine</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {categories.map((cat) => (
            <div 
              key={cat.mode}
              onClick={() => onStartMode(cat.mode)}
              className={`group cursor-pointer bg-white p-12 rounded-[4rem] border border-[#E54839]/5 shadow-sm hover:shadow-3xl hover:shadow-[#E54839]/10 transition-all space-y-8 relative overflow-hidden bg-gradient-to-br ${cat.color} hover:-translate-y-3`}
            >
              <div className="text-6xl group-hover:scale-110 transition-transform duration-500 inline-block drop-shadow-xl">{cat.icon}</div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-black traditional-font text-gray-900 tracking-tight leading-none">{cat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-2">{cat.desc}</p>
              </div>
              <div className="flex items-center gap-4 text-[#E54839] text-xs font-black uppercase tracking-[0.2em] pt-6">
                Enter Studio
                <div className="w-10 h-10 rounded-full bg-[#E54839]/10 flex items-center justify-center group-hover:bg-[#E54839] group-hover:text-white transition-all shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Footer with Enhanced Social Links */}
      <section className="px-6 md:px-0 pb-20">
        <div className="bg-gray-900 rounded-[4rem] md:rounded-[6rem] p-16 md:p-32 text-center space-y-12 shadow-3xl relative overflow-hidden group border border-white/5">
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#E54839]/10 via-transparent to-transparent opacity-50"></div>
           
           <div className="space-y-8 relative z-10">
             <span className="text-[10px] font-black text-[#E54839] uppercase tracking-[0.6em] animate-pulse">Orchestrated Community</span>
             <h2 className="text-5xl md:text-8xl font-black traditional-font text-white tracking-tighter leading-none">Join the Synthesis</h2>
             <p className="text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm md:text-xl px-4">
               The future of digital art is community-driven. See daily synthesis results and tips from the creator on Instagram.
             </p>
           </div>

           <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative z-10 pt-6">
             <a 
               href="https://www.instagram.com/vikkx.ai/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-5 px-12 py-6 bg-[#E54839] text-white rounded-full font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:scale-110 transition-all shadow-3xl shadow-[#E54839]/40 active:scale-95"
             >
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
               </svg>
               Follow vikkx.ai
             </a>
             <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-5 backdrop-blur-md">
                <div className="flex flex-col items-start">
                  <span className="text-white font-black text-base tracking-tight leading-none">@vikkx.ai</span>
                  <span className="text-[8px] text-[#E54839] font-black uppercase tracking-widest mt-1">Official Hub</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#E54839] creative-pulse"></div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
