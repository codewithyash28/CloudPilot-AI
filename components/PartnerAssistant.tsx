
import React, { useState } from 'react';
import { generateGCPSolution } from '../services/geminiService';
import { GeneratedSolution } from '../types';

interface PartnerAssistantProps {
  userId: string;
}

const PartnerAssistant: React.FC<PartnerAssistantProps> = ({ userId }) => {
  const [challenge, setChallenge] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<Partial<GeneratedSolution> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!challenge.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateGCPSolution(challenge);
      const newSolution: Partial<GeneratedSolution> = {
        ...data,
        challenge,
        timestamp: Date.now(),
        userId
      };
      
      setResult(newSolution);

      const existing = JSON.parse(localStorage.getItem(`solutions_${userId}`) || '[]');
      localStorage.setItem(`solutions_${userId}`, JSON.stringify([
        { ...newSolution, id: Math.random().toString(36).substr(2, 9) },
        ...existing
      ]));

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Business Strategy Advisor</h2>
            <p className="text-sm text-gray-400">Powered by Gemini AI Studio</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Describe your business or client challenge
            </label>
            <textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="e.g., We are a retail chain looking to implement a real-time inventory tracking system across 50 locations using cloud-native technologies."
              className="w-full h-40 p-4 bg-slate-50 border-2 border-slate-50 rounded-xl focus:bg-white focus:border-purple-500 text-gray-700 outline-none transition-all leading-relaxed"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !challenge.trim()}
            className={`w-full py-4 px-6 rounded-xl text-white font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
              isGenerating || !challenge.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100 active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing Strategy...
              </>
            ) : (
              'Consult CloudPilot AI'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 p-4 rounded-xl text-red-700 text-sm font-bold flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{result.title}</h3>
                <p className="text-purple-600 font-bold text-sm mt-1 uppercase tracking-widest">Architectural Manifest</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400">Reference: CP-{Math.floor(Math.random() * 9999)}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-3">Executive Summary</h4>
                <p className="text-gray-600 leading-relaxed text-lg italic border-l-4 border-purple-200 pl-4">
                  {result.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-lg mb-4">Technical Architecture</h4>
                <div className="bg-slate-900 p-8 rounded-2xl shadow-inner">
                  <pre className="text-purple-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                    {result.architecture}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🛠️</span> Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.services?.map((s, i) => (
                    <span key={i} className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 shadow-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <span>✨</span> Best Practices
                </h4>
                <ul className="text-xs text-indigo-700 space-y-3 font-medium">
                  {result.bestPractices?.map((bp, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-indigo-400">•</span>
                      {bp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerAssistant;
