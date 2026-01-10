
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
  credits: number;
  onDeductCredit: (amount: number) => boolean;
}

const RealisticGenerator: React.FC<Props> = ({ onGenerated, credits, onDeductCredit }) => {
  const [prompt, setPrompt] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const costPerPhoto = 10;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const totalCost = quantity * costPerPhoto;
    if (credits < totalCost) {
      setError(`Insufficient credits. Need ${totalCost} but have ${credits}.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    const fullPrompt = `Masterpiece hyper-realistic photography, ultra-detailed textures, 8k professional color grading: ${prompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const newImages: string[] = [];

      for (let i = 0; i < quantity; i++) {
        if (!onDeductCredit(costPerPhoto)) break;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: fullPrompt }] },
          config: { imageConfig: { aspectRatio: '1:1' } }
        });

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
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Hyper-realistic forms. <span className="text-[#E54839] font-black">{costPerPhoto} ✦</span> per photo.</p>
        </div>

        <div className="space-y-8 bg-white p-6 md:p-10 rounded-[3.5rem] shadow-2xl border-2 border-transparent">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantity ({quantity * costPerPhoto} Credits)</label>
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
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.3em] mb-4">Subject</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your subject in detail..."
              className="w-full h-44 p-6 bg-[#F5F2ED]/30 rounded-[2.5rem] outline-none text-sm font-medium resize-none shadow-inner"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || credits < quantity * costPerPhoto}
            className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
              loading || !prompt || credits < quantity * costPerPhoto
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2'
            }`}
          >
            {loading ? 'Synthesizing...' : credits < quantity * costPerPhoto ? 'Insufficient Credits' : `Execute Realism (${quantity * costPerPhoto} ✦)`}
          </button>
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="flex flex-col gap-8">
          {results.length > 0 ? (
            results.map((url, i) => (
              <img key={i} src={url} alt="Realistic synthesis" className="w-full bg-white rounded-[3.5rem] shadow-2xl border-[12px] border-white animate-in" />
            ))
          ) : (
            <div className="aspect-square bg-white rounded-[4rem] shadow-2xl flex items-center justify-center border-[12px] border-white">
              <span className="text-5xl opacity-20">👤</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealisticGenerator;
