
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Mode, GeneratedAsset } from '../types';

interface Props {
  onGenerated: (asset: GeneratedAsset) => void;
}

const ThumbnailGenerator: React.FC<Props> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Telugu');
  const [loading, setLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const languages = ['Telugu', 'Hindi', 'English'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    // Language specific style hints
    const langHints = {
      'Telugu': 'professional Telugu typography, Tollywood cinematic style, vibrant high-energy fonts',
      'Hindi': 'professional Hindi Devanagari typography, Bollywood cinematic poster style, bold Hindi lettering',
      'English': 'slick modern English sans-serif typography, high-conversion tech YouTuber aesthetic'
    };

    const fullPrompt = `High-conversion professional YouTube thumbnail, 4k ultra-high resolution, 16:9 cinematic aspect ratio, vibrant saturated colors, eye-catching focal point, realistic elements, ${langHints[language as keyof typeof langHints]} integration, viral aesthetic: ${prompt}`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: { imageConfig: { aspectRatio: '16:9' } }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          setGeneratedImageUrl(imageUrl);
          onGenerated({
            id: Date.now().toString(),
            type: Mode.THUMBNAIL,
            url: imageUrl,
            prompt: fullPrompt,
            timestamp: Date.now()
          });
          setPrompt(''); // Clear previous prompt after successful generation
          break;
        }
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
          <p className="text-gray-500 text-sm font-medium leading-relaxed">Multilingual professional YouTube assets for elite creators.</p>
        </div>

        <div className="space-y-8 bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-[#E54839]/5 traditional-border">
          <div>
            <label className="block text-[10px] font-black text-[#E54839] uppercase tracking-[0.3em] mb-4">Target Language</label>
            <div className="grid grid-cols-3 gap-3">
              {languages.map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`py-4 text-[10px] font-bold rounded-2xl border-2 transition-all ${
                    language === l 
                      ? 'bg-[#E54839] border-[#E54839] text-white shadow-lg' 
                      : 'border-gray-50 text-gray-400 hover:border-[#E54839]/20'
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
              placeholder="E.g. A mystery unboxing video with shocked expression and glowing box..."
              className="w-full h-36 p-6 bg-[#F5F2ED]/30 border-2 border-transparent focus:border-[#E54839]/20 rounded-[2.5rem] transition-all outline-none text-sm font-medium resize-none placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
              loading || !prompt
                ? 'bg-gray-100 text-gray-300'
                : 'bg-[#E54839] text-white hover:shadow-[#E54839]/50 hover:-translate-y-2'
            }`}
          >
            {loading ? 'Orchestrating Layout...' : 'Synthesize Thumbnail'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="aspect-video bg-white rounded-[4rem] shadow-2xl shadow-[#E54839]/5 flex items-center justify-center relative overflow-hidden border-[12px] border-white group">
          {generatedImageUrl ? (
            <img src={generatedImageUrl} alt="Professional Thumbnail" className="w-full h-full object-cover animate-in" />
          ) : (
            <div className="text-center space-y-6 px-12">
              <div className="w-32 h-32 bg-[#F5F2ED] rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-[#E54839]/20 rotate-3">
                <svg className="w-12 h-12 text-[#E54839]/20 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-xs mx-auto">High-conversion layout awaits your video narrative input.</p>
            </div>
          )}
          <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-[#E54839]/10 rounded-tl-[2rem]"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-b-4 border-r-4 border-[#E54839]/10 rounded-br-[2rem]"></div>
        </div>
        
        <div className="mt-8 flex justify-center gap-4">
           {['4K UHD', 'Viral Ready', 'Professional Lighting'].map(tag => (
             <span key={tag} className="px-5 py-2 bg-white/50 backdrop-blur-sm rounded-full text-[9px] font-black text-[#E54839] uppercase tracking-widest border border-[#E54839]/5 shadow-sm">
               {tag}
             </span>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
