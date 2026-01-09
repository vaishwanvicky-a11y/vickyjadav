
import React, { useState } from 'react';
import { Mode, GeneratedAsset } from './types';
import Header from './components/Header';
import Home from './components/Home';
import ImageGenerator from './components/ImageGenerator';
import AnimeGenerator from './components/AnimeGenerator';
import RealisticGenerator from './components/RealisticGenerator';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import WishGenerator from './components/WishGenerator';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<Mode>(Mode.HOME);
  const [gallery, setGallery] = useState<GeneratedAsset[]>([]);

  const addToGallery = (asset: GeneratedAsset) => {
    setGallery(prev => [asset, ...prev].slice(0, 12));
  };

  const renderContent = () => {
    switch (activeMode) {
      case Mode.HOME:
        return <Home onStartMode={(mode) => setActiveMode(mode)} />;
      case Mode.IMAGE:
        return <ImageGenerator onGenerated={addToGallery} />;
      case Mode.ANIME:
        return <AnimeGenerator onGenerated={addToGallery} />;
      case Mode.REALISTIC:
        return <RealisticGenerator onGenerated={addToGallery} />;
      case Mode.THUMBNAIL:
        return <ThumbnailGenerator onGenerated={addToGallery} />;
      case Mode.WISH:
        return <WishGenerator onGenerated={addToGallery} />;
      default:
        return <Home onStartMode={(mode) => setActiveMode(mode)} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F2ED] relative">
      <Sidebar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header activeMode={activeMode} />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 space-y-12 md:space-y-20 pb-32 md:pb-10">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>

          {activeMode !== Mode.HOME && gallery.length > 0 && (
            <section className="max-w-6xl mx-auto space-y-8 pt-12 md:pt-20 border-t border-[#E54839]/10">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl md:text-3xl font-bold traditional-font text-gray-800 tracking-tight">Studio Archives</h3>
                <span className="text-[10px] font-black text-[#E54839] uppercase tracking-widest px-4 py-1.5 bg-[#E54839]/5 rounded-full">Recent Synthesis</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 px-4">
                {gallery.map((asset) => (
                  <div key={asset.id} className="group relative aspect-square bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all traditional-border">
                    <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                      <p className="text-[10px] text-white line-clamp-3 italic leading-relaxed font-medium">{asset.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Global Accent */}
        <div className="hidden lg:block absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none -z-10">
           <svg width="200" height="200" viewBox="0 0 100 100" className="text-[#E54839]">
              <path d="M0 100 L100 100 L100 0 L95 0 L95 95 L0 95 Z" fill="currentColor" />
           </svg>
        </div>
      </main>
    </div>
  );
};

export default App;
