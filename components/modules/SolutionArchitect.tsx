
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const SolutionArchitect: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: `You are a Senior GCP Architect. Provide a quick high-level draft for: ${prompt}. Focus on services and speed.`
      });
      setResult(response.text || '');
    } catch (e) {
      console.error(e);
      setResult('Error generating draft. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2 text-sky-500">
          <span>🏗️</span> Solution Architect (Flash)
        </h2>
        <p className="text-sm text-gray-400 mb-6 font-medium uppercase tracking-widest">Instant architectural drafting for rapid response</p>
        
        <textarea 
          className="w-full h-32 p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white rounded-xl border dark:border-zinc-700 outline-none focus:ring-2 focus:ring-sky-500 mb-4 font-medium"
          placeholder="Describe the client requirement briefly..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-4 bg-sky-500 text-white font-black rounded-xl hover:bg-sky-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-sky-100 dark:shadow-none"
        >
          {loading ? 'Thinking Fast...' : 'Generate Instant Draft'}
        </button>
      </div>

      {result && (
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-widest">Proposed Draft</h3>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionArchitect;
