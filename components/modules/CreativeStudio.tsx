
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

/* 
 * Removed conflicting global declaration of window.aistudio. 
 * The 'AIStudio' type is already provided by the environment. 
 * We use type assertion to access it safely.
 */

const CreativeStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(false);

  // Helper to ensure user has selected a paid API key for Veo models as per guidelines
  const ensureApiKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
      }
    }
  };

  const generateImage = async () => {
    setLoading(true);
    setMediaUrl('');
    try {
      // Re-instantiate GoogleGenAI to ensure the latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      // Iterate through parts to find the image part (do not assume index 0)
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part && part.inlineData) {
        setMediaUrl(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    // Mandated step: Ensure API key selection for Veo models
    await ensureApiKey();
    setLoading(true);
    setMediaUrl('');
    try {
      // Create a fresh instance right before the call to ensure latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { 
          numberOfVideos: 1, // Required parameter
          resolution: '720p', 
          aspectRatio: '16:9' 
        }
      });
      
      // Polling for video generation completion
      while (!op.done) {
        await new Promise(r => setTimeout(r, 10000));
        op = await ai.operations.getVideosOperation({operation: op});
      }
      
      // Construct final media URL with the API key appended for fetching the MP4 bytes
      const videoUri = op.response?.generatedVideos?.[0]?.video?.uri;
      if (videoUri) {
        setMediaUrl(`${videoUri}&key=${process.env.API_KEY}`);
      }
    } catch (e: any) {
      console.error(e);
      // Handle project/key not found errors by resetting selection
      if (e.message?.includes("Requested entity was not found")) {
        alert("Please select a valid paid API key from a project with billing enabled.");
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          await aistudio.openSelectKey();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-rose-500">
          <span>🎨</span> Creative Studio
        </h2>
        
        <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl mb-6">
          <button onClick={() => setType('image')} className={`flex-1 py-3 rounded-lg font-black transition-all ${type === 'image' ? 'bg-white dark:bg-zinc-800 shadow-sm text-rose-500' : 'text-gray-400'}`}>Image Gen</button>
          <button onClick={() => setType('video')} className={`flex-1 py-3 rounded-lg font-black transition-all ${type === 'video' ? 'bg-white dark:bg-zinc-800 shadow-sm text-rose-500' : 'text-gray-400'}`}>Veo Video</button>
        </div>

        <div className="space-y-4">
          <textarea 
            className="w-full h-32 p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white rounded-xl border dark:border-zinc-700 outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            placeholder={`Describe your ${type} vision...`}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button 
            onClick={type === 'image' ? generateImage : generateVideo}
            disabled={loading || !prompt}
            className="w-full py-4 bg-rose-500 text-white font-black rounded-xl hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-rose-100 dark:shadow-none"
          >
            {loading ? 'Synthesizing (May take minutes)...' : `Generate ${type.toUpperCase()}`}
          </button>
        </div>
      </div>

      {mediaUrl && (
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
          {type === 'image' ? (
            <img src={mediaUrl} className="w-full h-auto" alt="AI Generation" />
          ) : (
            <video src={mediaUrl} className="w-full h-auto" controls autoPlay loop />
          )}
        </div>
      )}

      {type === 'video' && (
        <p className="text-xs text-center text-gray-400">
          Veo requires a billing-enabled API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">Billing Documentation</a>
        </p>
      )}
    </div>
  );
};

export default CreativeStudio;
