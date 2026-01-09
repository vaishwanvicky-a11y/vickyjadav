
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
}

const WishGenerator: React.FC<Props> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [essence, setEssence] = useState('Pure Imagination');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const essences = ['Pure Imagination', 'Surrealism', 'Mythological', 'Cyber-Organic', 'Ethereal Realism'];
  
  const surprises = [
    "A clockwork forest where trees are made of brass gears and birds are mechanical hummingbirds.",
    "A cosmic ocean where whales are made of nebulae and galaxies are their food.",
    "A hyper-realistic study of intimate human connection in a rain-slicked neon alleyway.",
    "A synthesis of organic beauty and industrial decay, high quality aesthetic.",
    "A moody landscape setting with dramatic shadows and high-fashion aesthetic."
  ];

  const handleRandomize = () => {
    const random = surprises[Math.floor(Math.random() * surprises.length)];
    setPrompt(random);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    const fullPrompt = `Masterpiece high-end art, ${essence} essence, unconventional creative synthesis, ethereal and complex, surreal masterpiece, high-end fine art aesthetic: ${prompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { 
          imageConfig: { aspectRatio: '1:1' }
        }
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(p => p.inlineData);

      if (imagePart && imagePart.inlineData) {
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        setGeneratedImageUrl(imageUrl);
        onGenerated({
          id: Date.now().toString(),
          type: Mode.WISH,
          url: imageUrl,
          prompt: fullPrompt,
          timestamp: Date.now()
        });
        // Correctly clear prompt
        setPrompt(''); 
      }
    } catch (err: any) {
      setError(err.message || 'The infinite wish failed to manifest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in p-6 rounded-[4rem] transition-all duration-700">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4 text-center lg:text-left">
          <div className="w-16 h-1 bg-[#E54839] rounded-full mx-auto lg:mx-0"></div>
          <h2 className="text-5xl font-bold traditional-font tracking-tight leading-tight text-gray-900">
            Infinite Wish
          </h2>
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <p className="text-xs font-black uppercase tracking-[0.4em] px-3 py-1.5 rounded-lg border bg-[#E54839]/5 border-[#E54839]/10 text-[#E54839]">
              Creative Sandbox
            </p>
          </div>
        </div>

        <div className="space-y-8 p-10 rounded-[3.5rem] shadow-2xl traditional-border bg-white shadow-[#E54839]/10 border-white/50">
          {error && <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-2xl border border-red-100">{error}</div>}
          
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#E54839]">Creative Essence</label>
            <div className="flex flex-wrap gap-2">
              {essences.map(e => (
                <button
                  key={e}
                  onClick={() => setEssence(e)}
                  className={`px-5 py-2.5 text-[10px] font-bold rounded-full border-2 transition-all ${
                    essence === e 
                      ? 'bg-[#E54839] border-[#E54839] text-white shadow-lg' 
                      : 'border-gray-50 text-gray-400 hover:border-[#E54839]/30'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#E54839]">The Vision</label>
              <button 
                onClick={handleRandomize}
                className="text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 text-gray-400 hover:text-[#E54839]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Inspiration
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Close your eyes and envision the impossible..."
              className="w-full h-44 p-7 border-2 border-transparent transition-all outline-none text-sm font-medium resize-none shadow-inner rounded-[2.5rem] bg-[#F5F2ED]/40 text-gray-800 placeholder:text-gray-300 focus:border-[#E54839]/10"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl ${
              loading || !prompt
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2 active:scale-95'
            }`}
          >
            {loading ? (
               <div className="flex items-center gap-3">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Granting Wish...
               </div>
            ) : 'Grant My Wish'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="aspect-square rounded-[5rem] shadow-2xl flex items-center justify-center relative overflow-hidden border-[16px] group transition-all duration-700 bg-white border-white">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Wish Manifested" className="w-full h-full object-cover animate-in scale-105 group-hover:scale-100 transition-transform duration-1000" />
          ) : (
            <div className="text-center space-y-8 max-w-sm px-10">
              <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto shadow-inner relative animate-pulse bg-[#E54839]/5">
                <svg className="w-16 h-16 text-[#E54839]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="font-bold traditional-font text-2xl tracking-tight text-gray-900">
                  Eternal Potential
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-loose text-gray-300">
                  Awaiting your purest or wildest creative turn.
                </p>
              </div>
            </div>
          )}
          <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 rounded-tl-[3rem] opacity-20 transition-colors border-[#E54839]"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 rounded-br-[3rem] opacity-20 transition-colors border-[#E54839]"></div>
        </div>
      </div>
    </div>
  );
};

export default WishGenerator;
