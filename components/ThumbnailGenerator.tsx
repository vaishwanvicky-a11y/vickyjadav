
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
  credits: number;
  onDeductCredit: (amount: number) => boolean;
}

const ThumbnailGenerator: React.FC<Props> = ({ onGenerated, credits, onDeductCredit }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Telugu');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const costPerLayout = 10;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (credits < costPerLayout) {
      setError(`Insufficient credits. You need ${costPerLayout} ✦.`);
      return;
    }

    setLoading(true);
    setError(null);

    const fullPrompt = `High-conversion professional YouTube thumbnail, 16:9 cinematic aspect ratio, vibrant viral aesthetic, language ${language}: ${prompt}`;

    try {
      if (!onDeductCredit(costPerLayout)) throw new Error("Out of credits.");
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: '16:9' } }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        setGeneratedImageUrl(imageUrl);
        onGenerated({
          id: Date.now().toString(),
          type: Mode.THUMBNAIL,
          url: imageUrl,
          prompt: fullPrompt,
          timestamp: Date.now()
        });
        setPrompt('');
      }
    } catch (err: any) {
      setError(err.message || 'Thumbnail synthesis error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in">
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-1 bg-[#E54839] rounded-full"></div>
          <h2 className="text-5xl font-bold traditional-font text-gray-900 tracking-tight leading-tight">Thumbnail Studio</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Elite creators toolkit. Costs <span className="text-[#E54839] font-black">{costPerLayout} ✦</span> per layout.</p>
        </div>

        <div className="space-y-8 bg-white p-10 rounded-[3.5rem] shadow-2xl traditional-border">
          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.3em] mb-4">Target Language</label>
            <div className="grid grid-cols-3 gap-3">
              {['Telugu', 'Hindi', 'English'].map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`py-4 text-[10px] font-bold rounded-2xl border-2 transition-all ${
                    language === l ? 'bg-[#E54839] border-[#E54839] text-white shadow-lg' : 'border-gray-50 text-gray-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.3em] mb-4">Video Narrative</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the thumbnail..."
              className="w-full h-36 p-6 bg-[#F5F2ED]/30 rounded-[2.5rem] outline-none text-sm font-medium resize-none shadow-inner"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || credits < costPerLayout}
            className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
              loading || !prompt || credits < costPerLayout
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2'
            }`}
          >
            {loading ? 'Orchestrating...' : credits < costPerLayout ? 'Insufficient Credits' : `Synthesize Layout (${costPerLayout} ✦)`}
          </button>
          {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="aspect-video bg-white rounded-[4rem] shadow-2xl flex items-center justify-center border-[12px] border-white">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-2xl animate-in" />
          ) : (
            <span className="text-5xl opacity-20">🎬</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
