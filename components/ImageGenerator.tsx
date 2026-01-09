
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
}

const ImageGenerator: React.FC<Props> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [heritageStyle, setHeritageStyle] = useState('Classic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const styles = [
    { name: 'Classic', desc: 'No modification' },
    { name: 'Filigree', desc: 'Intricate metal patterns' },
    { name: 'Ink Wash', desc: 'Sumi-e traditional ink' },
    { name: 'Ornamental', desc: 'Baroque & traditional floral' }
  ];

  const angleOptions = [
    { label: 'Down angle', promptAddon: 'viewed from high above, down angle perspective' },
    { label: 'Bottom angle', promptAddon: 'low angle shot, looking up from the bottom' },
    { label: 'Side angle', promptAddon: 'side profile view, cinematic side angle' }
  ];

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `vikkx-artifact-${Date.now()}.png`;
    link.click();
  };

  const handleApplyAngle = (addon: string) => {
    const base = prompt || "Highly detailed creative synthesis";
    const refined = `${base}, ${addon}`;
    setPrompt(refined);
    handleGenerate(refined);
  };

  const handleGenerate = async (overriddenPrompt?: string) => {
    const activePrompt = overriddenPrompt || prompt;
    if (!activePrompt.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    const stylePrompt = heritageStyle === 'Classic' ? '' : `, styled with heavy ${heritageStyle} traditional motifs, highly detailed ornamentation`;
    const fullPrompt = `${activePrompt}${stylePrompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const promises = Array.from({ length: quantity }).map(() => 
        ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: fullPrompt }] },
          config: { imageConfig: { aspectRatio: aspectRatio as any } }
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
            type: Mode.IMAGE,
            url: imageUrl,
            prompt: fullPrompt,
            timestamp: Date.now()
          });
        }
      }
      setResults(newImages);
    } catch (err: any) {
      setError(err.message || 'Synthesis error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 animate-in p-4 pb-20">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-3">
          <div className="w-10 h-1 bg-[#E54839] rounded-full"></div>
          <h2 className="text-4xl font-bold traditional-font text-gray-900 tracking-tight leading-none">Vision Engine</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Synthesis of professional grade imagery with advanced perspective controls.</p>
        </div>

        <div className="space-y-6 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-[#E54839]/5 border-2 border-[#E54839]/5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity to generate?</label>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuantity(n)}
                    className={`flex-1 py-3.5 rounded-xl border-2 font-black text-xs transition-all ${
                      quantity === n ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'border-gray-50 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Format Ratio</label>
               <select 
                value={aspectRatio} 
                onChange={e => setAspectRatio(e.target.value)}
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 focus:ring-2 focus:ring-[#E54839]/10 outline-none"
               >
                 {['1:1', '4:3', '16:9', '3:4', '9:16'].map(r => <option key={r} value={r}>{r}</option>)}
               </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.2em] mb-4">Synthesis Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision in detail..."
              className="w-full h-32 p-5 bg-[#F5F2ED]/30 border border-transparent rounded-3xl focus:ring-4 focus:ring-[#E54839]/5 transition-all outline-none text-sm font-medium resize-none placeholder:text-gray-300 shadow-inner"
            />
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt}
            className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
              loading || !prompt
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/40 hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="vik-loading-box">
                <div className="vik-loading-ring"></div>
                <div className="vik-loading-dot"></div>
              </div>
            ) : 'Synthesize Imagery'}
          </button>
          
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>

        {results.length > 0 && (
          <div className="space-y-6 animate-in">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">Angle Category</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {angleOptions.map((angle, idx) => (
                <button
                  key={angle.label}
                  onClick={() => handleApplyAngle(angle.promptAddon)}
                  disabled={loading}
                  className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center gap-2 hover:border-[#E54839] hover:bg-[#E54839]/5 transition-all group active:scale-95"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#E54839] text-center">{angle.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-8">
          {results.length > 0 ? (
            results.map((url, i) => (
              <div key={i} className="group relative bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in border-[12px] border-white" style={{animationDelay: `${i * 0.15}s`}}>
                <img src={url} alt="Synthesis Result" className="w-full object-cover rounded-2xl" />
                
                {/* Special themed download button overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDownload(url)}
                    className="btn-artifact px-8 py-4 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-3xl hover:scale-110 transition-transform flex items-center gap-3 border border-white/20"
                  >
                    <svg className="w-5 h-5 text-[#E54839]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Artifact
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="aspect-square bg-white rounded-[4rem] shadow-2xl flex items-center justify-center relative overflow-hidden border-8 border-white">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-[#F5F2ED] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-[#E54839]/20 creative-pulse">
                  <svg className="w-10 h-10 text-[#E54839]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.5em]">Studio Empty</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
