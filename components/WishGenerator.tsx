
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
  credits: number;
  onDeductCredit: (amount: number) => boolean;
}

const WishGenerator: React.FC<Props> = ({ onGenerated, credits, onDeductCredit }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const costPerWish = 10;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (credits < costPerWish) {
      setError(`Insufficient credits. You need ${costPerWish} ✦.`);
      return;
    }

    setLoading(true);
    setError(null);

    const fullPrompt = `Masterpiece high-end art, unconventional creative synthesis: ${prompt}`;

    try {
      if (!onDeductCredit(costPerWish)) throw new Error("Out of credits.");

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
          type: Mode.WISH,
          url: imageUrl,
          prompt: fullPrompt,
          timestamp: Date.now()
        });
        setPrompt(''); 
      }
    } catch (err: any) {
      setError(err.message || 'manifestation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in p-6 rounded-[4rem]">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-1 bg-[#E54839] rounded-full"></div>
          <h2 className="text-5xl font-bold traditional-font text-gray-900 tracking-tight">Infinite Wish</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">The sandbox. <span className="text-[#E54839] font-black">{costPerWish} ✦</span> per manifestation.</p>
        </div>

        <div className="space-y-8 p-10 rounded-[3.5rem] shadow-2xl bg-white border-2 border-transparent">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Envision the impossible..."
            className="w-full h-44 p-7 bg-[#F5F2ED]/40 rounded-[2.5rem] outline-none text-sm font-medium resize-none shadow-inner"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || credits < costPerWish}
            className={`w-full py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl ${
              loading || !prompt || credits < costPerWish ? 'bg-gray-100 text-gray-300' : 'bg-[#E54839] text-white hover:-translate-y-2'
            }`}
          >
            {loading ? 'Granting...' : credits < costPerWish ? 'Out of Credits' : `Grant Wish (${costPerWish} ✦)`}
          </button>
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="aspect-square rounded-[5rem] shadow-2xl flex items-center justify-center border-[16px] bg-white border-white">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Wish" className="w-full h-full object-cover rounded-2xl animate-in" />
          ) : (
            <span className="text-5xl opacity-20">🌟</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishGenerator;
