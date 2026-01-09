
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
}

const RealisticGenerator: React.FC<Props> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [lighting, setLighting] = useState('Studio Cinematic');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const lightingStyles = ['Studio Cinematic', 'Golden Hour', 'Deep Shadows', 'Natural Soft', 'High Contrast'];

  const angles = [
    { label: 'Down angle', prompt: 'high angle view, overhead perspective' },
    { label: 'Bottom angle', prompt: 'low angle perspective, dramatic look up' },
    { label: 'Side angle', prompt: 'side profile, side view perspective' }
  ];

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `vik-realism-${Date.now()}.png`;
    link.click();
  };

  const handleRefineAngle = async (anglePrompt: string) => {
    if (!prompt.trim() && results.length === 0) return;
    const basePrompt = prompt || "Highly realistic human portrait";
    const newPrompt = `${basePrompt}, ${anglePrompt}`;
    setPrompt(newPrompt);
    handleGenerate(newPrompt);
  };

  const handleGenerate = async (overriddenPrompt?: string) => {
    const activePrompt = overriddenPrompt || prompt;
    if (!activePrompt.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    const fullPrompt = `Masterpiece hyper-realistic photography, ${lighting} lighting, ultra-detailed human skin textures, detailed iris, fine hair strands, high-end DSLR 8k, photorealism, professional color grading, realistic human features: ${activePrompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const promises = Array.from({ length: quantity }).map(() => 
        ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: fullPrompt }] },
          config: { imageConfig: { aspectRatio: '1:1' } }
        })
      );

      const responses = await Promise.all(promises);
      const newImages: string[] = [];

      for (const response of responses) {
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          newImages.push(imageUrl);
          onGenerated({
            id: Math.random().toString(36).substr(2, 9),
            type: Mode.REALISTIC,
            url: imageUrl,
            prompt: fullPrompt,
            timestamp: Date.now()
          });
        }
      }
      
      setResults(newImages);
      if (!overriddenPrompt) setPrompt(''); 
    } catch (err: any) {
      setError(err.message || 'Synthesis error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 animate-in p-4 pb-20">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-1 bg-[#E54839] rounded-full"></div>
          <h2 className="text-5xl font-bold traditional-font text-gray-900 tracking-tight leading-tight">Super Realism</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Synthesis of hyper-realistic human forms with precision quantity and perspective control.</p>
        </div>

        <div className="space-y-8 bg-white p-6 md:p-10 rounded-[3.5rem] shadow-2xl shadow-[#E54839]/5 traditional-border">
          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.3em] mb-4">Portrait Lighting</label>
            <div className="flex flex-wrap gap-2">
              {lightingStyles.map(l => (
                <button
                  key={l}
                  onClick={() => setLighting(l)}
                  className={`px-5 py-2.5 text-[10px] font-bold rounded-full border-2 transition-all ${
                    lighting === l 
                      ? 'bg-[#E54839] border-[#E54839] text-white shadow-lg' 
                      : 'border-gray-50 text-gray-400 hover:border-[#E54839]/20'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">How many photos you want to generate?</label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setQuantity(n)}
                  className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${
                    quantity === n ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-50 text-gray-400'
                  }`}
                >
                  {n} Photo{n > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.3em] mb-4">The Subject</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your subject in detail..."
              className="w-full h-44 p-6 bg-[#F5F2ED]/30 border-2 border-transparent focus:border-[#E54839]/20 rounded-[2.5rem] transition-all outline-none text-sm font-medium resize-none placeholder:text-gray-300 shadow-inner"
            />
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt}
            className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
              loading || !prompt
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2'
            }`}
          >
            {loading ? (
               <div className="vik-loading-box">
                <div className="vik-loading-ring"></div>
                <div className="vik-loading-dot"></div>
               </div>
            ) : 'Execute Super-Realism'}
          </button>

          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>

        {results.length > 0 && (
          <div className="space-y-4 animate-in">
            <div className="flex items-center gap-3">
              <div className="h-0.5 flex-1 bg-gray-100"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Angle Category</span>
              <div className="h-0.5 flex-1 bg-gray-100"></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {angles.map(a => (
                <button
                  key={a.label}
                  onClick={() => handleRefineAngle(a.prompt)}
                  disabled={loading}
                  className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center gap-2 hover:border-[#E54839] hover:bg-[#E54839]/5 transition-all group active:scale-95"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#E54839] text-center">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-7">
        <div className="flex flex-col gap-8">
          {results.length > 0 ? (
            results.map((url, i) => (
              <div key={i} className="group relative bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-[12px] border-white animate-in" style={{animationDelay: `${i * 0.1}s`}}>
                <img src={url} alt="Realistic synthesis" className="w-full rounded-3xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleDownload(url)}
                    className="p-5 bg-white text-gray-900 rounded-full hover:scale-110 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="aspect-square bg-white rounded-[4rem] shadow-2xl shadow-[#E54839]/5 flex items-center justify-center relative overflow-hidden border-[12px] border-white group">
              <div className="text-center space-y-6 max-w-xs px-8">
                <div className="w-32 h-32 bg-[#F5F2ED] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-[#E54839]/20">
                  <svg className="w-12 h-12 text-[#E54839]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 font-bold traditional-font text-xl tracking-tight">Lens Awaits Subject</p>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-loose">Hyper-realistic synthesis requires detailed descriptive prompts.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealisticGenerator;
