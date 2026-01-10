
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
  onBack?: () => void;
  credits: number;
  onDeductCredit: (amount: number) => boolean;
}

const AnimeGenerator: React.FC<Props> = ({ onGenerated, onBack, credits, onDeductCredit }) => {
  const [vibe, setVibe] = useState('Vibrant');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const costPerArt = 10;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (credits < costPerArt) {
      setError(`Insufficient credits. You need ${costPerArt} ✦.`);
      return;
    }

    setLoading(true);
    setError(null);

    const fullPrompt = `High quality anime-styled masterpiece, ${vibe} mood, professional aesthetic: ${prompt}`;

    try {
      if (!onDeductCredit(costPerArt)) throw new Error("Credit deduction failed.");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: '1:1' } }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        setGeneratedImageUrl(imageUrl);
        onGenerated({
          id: Date.now().toString(),
          type: Mode.ANIME,
          url: imageUrl,
          prompt: fullPrompt,
          timestamp: Date.now()
        });
        setPrompt(''); 
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in pb-20">
      <div className="lg:col-span-5 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="w-12 h-1.5 bg-[#E54839] rounded-full"></div>
            <h2 className="text-5xl font-bold traditional-font text-gray-900 tracking-tight leading-none">Anime Studio</h2>
          </div>
          {onBack && (
            <button onClick={onBack} className="md:hidden p-3 bg-white shadow-xl rounded-2xl text-[#E54839]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
        </div>
        
        <p className="text-gray-500 text-sm font-medium leading-relaxed">Artisan-grade anime illustration. Costs <span className="text-[#E54839] font-black">{costPerArt} ✦</span> per art piece.</p>

        <div className="space-y-8 bg-white p-10 rounded-[3.5rem] shadow-3xl shadow-[#E54839]/5 border-2 border-transparent">
          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.4em] mb-4">Scene Narrative</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the keyframe..."
              className="w-full h-44 p-7 bg-[#F5F2ED]/40 rounded-[2.5rem] outline-none text-sm font-medium resize-none shadow-inner"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || credits < costPerArt}
            className={`w-full py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
              loading || !prompt || credits < costPerArt
                ? 'bg-gray-50 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2'
            }`}
          >
            {loading ? 'Synthesizing...' : credits < costPerArt ? 'Insufficient Credits' : `Synthesize Art (${costPerArt} ✦)`}
          </button>
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="aspect-square bg-white rounded-[4.5rem] shadow-3xl flex items-center justify-center relative overflow-hidden border-[16px] border-white">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Anime Synthesis" className="w-full h-full object-cover animate-in" />
          ) : (
            <div className="text-center space-y-4">
               <span className="text-5xl">✨</span>
               <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest">Awaiting Keyframe Narrative</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeGenerator;
