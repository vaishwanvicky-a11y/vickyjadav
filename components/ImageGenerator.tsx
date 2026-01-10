
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
  onBack?: () => void;
  credits: number;
  onDeductCredit: (amount: number) => boolean;
}

const ImageGenerator: React.FC<Props> = ({ onGenerated, onBack, credits, onDeductCredit }) => {
  const [prompt, setPrompt] = useState('');
  const [heritageStyle, setHeritageStyle] = useState('Classic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const costPerImage = 10;

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `vikkx-artifact-${Date.now()}.png`;
    link.click();
  };

  const handleGenerate = async (overriddenPrompt?: string) => {
    const activePrompt = overriddenPrompt || prompt;
    if (!activePrompt.trim()) return;
    
    const totalCost = quantity * costPerImage;
    if (credits < totalCost) {
      setError(`Insufficient credits. You need ${totalCost} but have ${credits}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    const stylePrompt = heritageStyle === 'Classic' ? '' : `, styled with heavy ${heritageStyle} traditional motifs`;
    const fullPrompt = `${activePrompt}${stylePrompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newImages: string[] = [];

      for (let i = 0; i < quantity; i++) {
        // Deduct 10 credits per image
        if (!onDeductCredit(costPerImage)) {
          setError("Session interrupted. Out of credits.");
          break;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: fullPrompt }] },
          config: { imageConfig: { aspectRatio: aspectRatio as any } }
        });

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
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="w-10 h-1 bg-[#E54839] rounded-full"></div>
            <h2 className="text-4xl font-bold traditional-font text-gray-900 tracking-tight leading-none">Vision Engine</h2>
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden flex items-center gap-2 p-3 bg-white shadow-lg rounded-2xl text-[#E54839] active:scale-95 transition-all border border-[#E54839]/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
        </div>
        
        <p className="text-gray-500 text-sm font-medium leading-relaxed">Synthesis of professional grade imagery. Each generation costs <span className="text-[#E54839] font-black">{costPerImage} ✦</span>.</p>

        <div className="space-y-6 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-[#E54839]/5 border-2 border-[#E54839]/5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity ({quantity * costPerImage} Credits)</label>
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
            disabled={loading || !prompt || credits < quantity * costPerImage}
            className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
              loading || !prompt || credits < quantity * costPerImage
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/40 hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="vik-loading-box">
                <div className="vik-loading-ring"></div>
                <div className="vik-loading-dot"></div>
              </div>
            ) : credits < quantity * costPerImage ? 'Insufficient Credits' : `Synthesize (${quantity * costPerImage} ✦)`}
          </button>
          
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-8">
          {results.length > 0 ? (
            results.map((url, i) => (
              <div key={i} className="group relative bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in border-[12px] border-white" style={{animationDelay: `${i * 0.15}s`}}>
                <img src={url} alt="Synthesis Result" className="w-full object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDownload(url)}
                    className="px-8 py-4 bg-white text-gray-900 rounded-full font-black text-xs uppercase tracking-widest shadow-3xl hover:scale-110 transition-transform flex items-center gap-3"
                  >
                    Download Artifact
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="aspect-square bg-white rounded-[4rem] shadow-2xl flex items-center justify-center relative border-8 border-white">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#F5F2ED] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-[#E54839]/10">
                  <span className="text-4xl">🖼️</span>
                </div>
                <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.5em]">Studio Canvas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
