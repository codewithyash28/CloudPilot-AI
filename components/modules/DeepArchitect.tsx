
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const DeepArchitect: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeepSolve = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 16000 }
        }
      });
      setResult(response.text || '');
    } catch (e) {
      console.error(e);
      setResult('Reasoning failed. Check model availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-700">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2 text-indigo-400">
          <span>🧠</span> Deep Architect
        </h2>
        <p className="text-sm text-zinc-500 mb-6 font-bold uppercase tracking-[0.2em]">Deep reasoning engine for complex migrations</p>
        
        <textarea 
          className="w-full h-48 p-4 bg-zinc-800 text-indigo-50 rounded-xl border border-zinc-700 outline-none focus:ring-2 focus:ring-indigo-500 mb-4 font-mono text-sm leading-relaxed"
          placeholder="Paste complex logs, legacy architecture schemas, or intricate business requirements..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={handleDeepSolve}
          disabled={loading || !prompt}
          className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-900/20"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
              <div className="animate-pulse delay-75 w-2 h-2 bg-white rounded-full"></div>
              <div className="animate-pulse delay-150 w-2 h-2 bg-white rounded-full"></div>
              <span>Processing Reasoning Chain...</span>
            </div>
          ) : 'Execute Thinking Mode'}
        </button>
      </div>

      {result && (
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b dark:border-zinc-700">
             <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
             <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-widest text-sm">Reasoned Resolution</h3>
          </div>
          <div className="text-gray-600 dark:text-gray-300 font-medium whitespace-pre-wrap leading-loose">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepArchitect;
