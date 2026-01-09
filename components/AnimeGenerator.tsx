
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
}

const AnimeGenerator: React.FC<Props> = ({ onGenerated }) => {
  const [subMode, setSubMode] = useState<'ART' | 'COMIC'>('ART');
  const [vibe, setVibe] = useState('Vibrant');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const vibes = ['Vibrant', 'Ethereal', 'Gothic', 'Minimalist', 'Retro 90s'];

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `vikkx-anime-artifact-${Date.now()}.png`;
    link.click();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    const stylePrefix = subMode === 'ART' 
      ? `High quality anime-styled masterpiece, ${vibe} mood, aesthetic line art, keyframe animation style: ` 
      : `Professional full page comic book, ${vibe} colors, cinematic multi-panel layout, manga page aesthetic: `;
    
    const fullPrompt = `${stylePrefix}${prompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: subMode === 'ART' ? '1:1' : '9:16' } }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          setGeneratedImageUrl(imageUrl);
          onGenerated({
            id: Date.now().toString(),
            type: Mode.ANIME,
            url: imageUrl,
            prompt: fullPrompt,
            timestamp: Date.now()
          });
          setPrompt(''); 
          break;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in pb-20">
      <div className="lg:col-span-5 space-y-10 anime-frame-float">
        <div className="space-y-4">
          <div className="w-12 h-1.5 bg-[#E54839] rounded-full"></div>
          <h2 className="text-5xl font-bold traditional-font text-gray-900 tracking-tight leading-none">Anime Studio</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Artisan-grade anime illustration and comic orchestration with keyframe precision.</p>
        </div>

        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border-2 border-[#E54839]/5 flex relative overflow-hidden">
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gray-900 rounded-[2rem] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${subMode === 'COMIC' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`}></div>
          <button
            onClick={() => setSubMode('ART')}
            className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative z-10 ${
              subMode === 'ART' ? 'text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Synthesis Art
          </button>
          <button
            onClick={() => setSubMode('COMIC')}
            className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative z-10 ${
              subMode === 'COMIC' ? 'text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Comic Frame
          </button>
        </div>

        <div className="space-y-8 bg-white p-10 rounded-[3.5rem] shadow-3xl shadow-[#E54839]/5 border-2 border-transparent hover:border-[#E54839]/10 transition-all group">
          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.4em] mb-4">Aesthetic Vibe</label>
            <div className="flex flex-wrap gap-2">
              {vibes.map(v => (
                <button
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`px-6 py-3 text-[10px] font-black rounded-full border-2 transition-all ${
                    vibe === v 
                      ? 'bg-[#E54839] border-[#E54839] text-white shadow-xl scale-105' 
                      : 'border-gray-50 text-gray-400 hover:border-[#E54839]/30'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.4em] mb-4">Scene Narrative</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the keyframe..."
              className="w-full h-44 p-7 bg-[#F5F2ED]/40 border-2 border-transparent focus:border-[#E54839]/10 rounded-[2.5rem] transition-all outline-none text-sm font-medium resize-none placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-3xl active:scale-95 ${
              loading || !prompt
                ? 'bg-gray-50 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2'
            }`}
          >
            {loading ? (
              <div className="vik-loading-box scale-75">
                <div className="vik-loading-ring"></div>
                <div className="vik-loading-dot"></div>
              </div>
            ) : `Synthesize Keyframe`}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className={`bg-white rounded-[4.5rem] shadow-3xl shadow-[#E54839]/10 flex items-center justify-center relative overflow-hidden group border-[16px] border-white transition-all duration-1000 ${subMode === 'ART' ? 'aspect-square' : 'aspect-[9/16]'}`}>
          {generatedImageUrl ? (
            <div className="relative w-full h-full group">
              <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-cover animate-in scale-105 group-hover:scale-100 transition-transform duration-[1500ms]" />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button 
                  onClick={handleDownload}
                  className="btn-artifact px-10 py-5 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-110 transition-transform flex items-center gap-4 border-2 border-white/20"
                >
                  <svg className="w-6 h-6 text-[#E54839]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Artifact
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <div className="w-32 h-32 bg-[#F5F2ED] rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-[#E54839]/10 creative-pulse">
                <svg className="w-12 h-12 text-[#E54839]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="space-y-2 px-8">
                <p className="text-gray-900 font-bold traditional-font text-3xl tracking-tight">Stage Awaits</p>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">Synthesis of keyframe aesthetics and neural coloring.</p>
              </div>
            </div>
          )}
          
          <div className="absolute top-12 left-12 w-24 h-24 border-t-4 border-l-4 border-[#E54839]/10 rounded-tl-[3.5rem]"></div>
          <div className="absolute bottom-12 right-12 w-24 h-24 border-b-4 border-r-4 border-[#E54839]/10 rounded-br-[3.5rem]"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimeGenerator;
