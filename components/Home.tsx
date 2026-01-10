
import React from 'react';
import { Mode } from '../types';
import { Logo } from './Logo';

interface HomeProps {
  onStartMode: (mode: Mode) => void;
  credits: number;
}

const Home: React.FC<HomeProps> = ({ onStartMode, credits }) => {
  const categories = [
    { mode: Mode.REALISTIC, title: 'Super Realism', desc: 'Flawless human portraits and lifelike reality.', icon: '👤', color: 'from-blue-500/10 to-transparent' },
    { mode: Mode.ANIME, title: 'Anime Studio', desc: 'Vibrant manga art & comic synthesis.', icon: '✨', color: 'from-purple-500/10 to-transparent' },
    { mode: Mode.IMAGE, title: 'Vision Engine', desc: 'Artistic fusion and traditional heritage art.', icon: '🖼️', color: 'from-amber-500/10 to-transparent' },
    { mode: Mode.WISH, title: 'Infinite Wish', desc: 'Manifest your most unconventional creative ideas.', icon: '🌟', color: 'from-[#E54839]/10 to-transparent' },
  ];

  return (
    <div className="space-y-16 md:space-y-24 animate-in pb-32">
      <section className="text-center space-y-10 md:space-y-16 py-12 md:py-24 relative px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-gradient-to-b from-[#E54839]/10 to-transparent rounded-full blur-[120px] -z-10"></div>
        <div className="flex justify-center"><Logo size="lg" /></div>
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-9xl font-[900] traditional-font text-gray-900 tracking-tighter leading-[0.95]">
            Professional <span className="text-[#E54839]">Synthesis</span> Hub
          </h1>
          <p className="text-lg md:text-2xl text-gray-500 font-medium italic">"Bridging imagination and neural technology."</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-4">
           <button onClick={() => onStartMode(Mode.IMAGE)} className="px-12 py-6 bg-[#E54839] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.05] transition-all">
             Start Generating
           </button>
           <div className="px-8 py-5 bg-white/50 backdrop-blur-md rounded-[2rem] border border-[#E54839]/10 shadow-sm">
              <span className="text-2xl font-black text-gray-900 traditional-font">{credits} ✦</span>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {categories.map((cat) => (
          <div key={cat.mode} onClick={() => onStartMode(cat.mode)} className={`group cursor-pointer bg-white p-8 rounded-[3rem] border border-[#E54839]/5 shadow-sm hover:shadow-2xl transition-all space-y-6 bg-gradient-to-br ${cat.color} hover:-translate-y-2`}>
            <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black traditional-font text-gray-900">{cat.title}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="max-w-4xl mx-auto py-24 border-t border-[#E54839]/10 text-center space-y-12 px-6">
        <div className="space-y-4">
          <span className="text-[10px] font-black text-[#E54839] uppercase tracking-[0.5em]">The Visionary behind VIKKX</span>
          <h2 className="text-4xl md:text-6xl font-black traditional-font text-gray-900 tracking-tight">Studio Archive</h2>
        </div>
        <div className="flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-2xl relative">
            VJ
            <div className="absolute -inset-1 border border-[#E54839]/20 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-black text-2xl md:text-3xl uppercase tracking-widest traditional-font">VAISHWAN JADAV</p>
            <p className="text-[#E54839] text-xs font-black uppercase tracking-[0.4em]">Lead Architect & Founder</p>
          </div>
          <p className="max-w-xl text-gray-500 text-sm md:text-base leading-relaxed italic border-l-4 border-[#E54839]/10 pl-6 text-left mx-auto">
            "VIKKX was born from the desire to bridge the gap between human heritage and neural futures. We don't just generate pixels; we synthesize the raw essence of imagination into tangible digital artifacts."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
