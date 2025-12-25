
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const MarketIntel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setResults({
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      });
    } catch (e) {
      console.error(e);
      setResults({ text: 'Intel gathering failed. Grounding unavailable.', sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
        <h2 className="text-2xl font-black mb-2 text-amber-500">🌐 Market Intel</h2>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">Real-time Grounding in Google Search & Maps</p>
        <div className="flex gap-4">
          <input 
            className="flex-1 p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white rounded-xl border dark:border-zinc-700 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            placeholder="Ask about competitors, trending regions, or specific business locations..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !query}
            className="bg-amber-500 text-white px-8 py-4 rounded-xl font-black hover:bg-amber-600 shadow-xl shadow-amber-100 dark:shadow-none transition-all active:scale-95"
          >
            {loading ? 'Scanning...' : 'Fetch Intel'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700 animate-in fade-in">
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8">
            {results.text}
          </div>
          
          {results.sources.length > 0 && (
            <div className="pt-6 border-t dark:border-zinc-700">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Verification Sources</h4>
              <div className="flex flex-wrap gap-2">
                {results.sources.map((chunk: any, i: number) => chunk.web && (
                  <a key={i} href={chunk.web.uri} target="_blank" rel="noopener" className="text-xs bg-amber-50 dark:bg-amber-900/10 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 transition-colors">
                    {chunk.web.title || 'Source Reference'}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketIntel;
