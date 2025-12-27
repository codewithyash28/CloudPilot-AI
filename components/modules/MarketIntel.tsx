
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const MarketIntel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResults(null);

    let latLng = undefined;
    try {
      const position: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      latLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (e) {
      console.warn("Location access denied, proceeding without proximity context.");
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: latLng ? {
            retrievalConfig: { latLng }
          } : undefined
        }
      });
      setResults({
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      });
    } catch (e) {
      console.error(e);
      setResults({ text: 'Intel gathering failed. Grounding modules are currently offline.', sources: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-800 p-10 rounded-3xl shadow-sm border dark:border-zinc-700">
        <h2 className="text-3xl font-black mb-2 text-amber-500 tracking-tight">🌐 Market Intel</h2>
        <p className="text-sm text-gray-400 font-black uppercase tracking-[0.2em] mb-8">Real-time Grounding in Google Search & Maps</p>
        <div className="flex gap-4">
          <input 
            className="flex-1 p-5 bg-slate-50 dark:bg-zinc-900 dark:text-white rounded-2xl border dark:border-zinc-700 outline-none focus:ring-2 focus:ring-amber-500 font-semibold transition-all"
            placeholder="Search market trends, competitor footprints, or regional business metrics..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !query}
            className="bg-amber-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-amber-600 shadow-2xl shadow-amber-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Scan Market'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white dark:bg-zinc-800 p-10 rounded-3xl shadow-sm border dark:border-zinc-700 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-medium leading-loose mb-10 text-lg">
            {results.text}
          </div>
          
          {results.sources.length > 0 && (
            <div className="pt-8 border-t dark:border-zinc-700">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Verified Grounding Sources</h4>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {results.sources.map((chunk: any, i: number) => (
                    chunk.web ? (
                      <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 transition-all font-bold shadow-sm">
                        🔗 {chunk.web.title || 'Data Source'}
                      </a>
                    ) : chunk.maps ? (
                      <div key={i} className="flex flex-col gap-2">
                        <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 transition-all font-bold shadow-sm inline-block">
                          📍 {chunk.maps.title || 'Maps Reference'}
                        </a>
                        {chunk.maps.placeAnswerSources?.reviewSnippets?.map((snippet: string, idx: number) => (
                          <p key={idx} className="text-[10px] text-gray-400 italic pl-4 border-l-2 border-emerald-100">
                            "{snippet}"
                          </p>
                        ))}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketIntel;
