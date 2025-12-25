
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const IntelligenceLab: React.FC = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: base64, mimeType: file.type } },
              { text: "Analyze this file in depth. If it is an image, describe details. If it's a document, summarize it." }
            ]
          }
        });
        setResult(response.text || '');
      } catch (err) {
        setResult('Analysis failed.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
        <h2 className="text-2xl font-black mb-2 text-violet-600">🔬 Intelligence Lab</h2>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">Multimodal vision & document analysis engine</p>
        
        <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 dark:border-zinc-700 rounded-3xl group hover:border-violet-300 dark:hover:border-violet-500 transition-all cursor-pointer relative">
          <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">📤</span>
          <p className="font-bold text-gray-600 dark:text-gray-300">Drop vision data or click to upload</p>
          <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, PDF, and MP4</p>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={loading} />
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
           <div className="animate-spin h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full mx-auto"></div>
           <p className="mt-4 font-bold text-violet-600 animate-pulse">Deep Scanning Modalities...</p>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b pb-4">Lab Findings</h3>
           <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-loose">
             {result}
           </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceLab;
