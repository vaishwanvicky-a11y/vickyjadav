
import React, { useState } from 'react';
import { Logo } from './Logo';

interface AuthModalProps {
  onLogin: (name: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    setLoading(true);
    // Simulate account setup
    setTimeout(() => {
      onLogin(name);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F2ED] p-4 md:p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")' }}></div>
      
      <div className="w-full max-w-lg bg-white rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(229,72,57,0.15)] p-8 md:p-14 space-y-12 border-4 border-white relative z-10 overflow-hidden">
        
        <div className="flex flex-col items-center text-center space-y-6">
          <Logo size="lg" className="scale-100 md:scale-110" />
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black traditional-font text-gray-900 tracking-tight">Enter Your Studio</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Create your professional neural account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#E54839]/10 rounded-[2rem] outline-none text-sm font-bold transition-all shadow-inner"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Studio Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure your creations"
                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#E54839]/10 rounded-[2rem] outline-none text-sm font-bold transition-all shadow-inner"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !name || !password}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-4 bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl transition-all hover:bg-black active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="vik-loading-box scale-50">
                <div className="vik-loading-ring"></div>
                <div className="vik-loading-dot"></div>
              </div>
            ) : (
              'Confirm & Enter Studio'
            )}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </form>

        <div className="text-center space-y-4">
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">New Session Bonus</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>
          <p className="text-[9px] text-[#E54839] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E54839] animate-pulse"></span>
            100 Generation Credits Included
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
