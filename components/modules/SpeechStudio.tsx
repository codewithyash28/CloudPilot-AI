
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

// Decoding helpers as required for raw PCM data
function decode(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SpeechStudio: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Zephyr');
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const generateSpeech = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
        }
      });
      
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error(e);
      alert('Speech generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border dark:border-zinc-700">
        <h2 className="text-2xl font-black mb-2 text-slate-700 dark:text-white">🔊 Speech Studio</h2>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-8">Professional Voice Synthesis</p>
        
        <div className="space-y-4">
          <textarea 
            className="w-full h-40 p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white rounded-xl border dark:border-zinc-700 outline-none focus:ring-2 focus:ring-slate-500 font-medium"
            placeholder="Type content for professional narration..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <select className="p-3 bg-slate-100 dark:bg-zinc-900 dark:text-white rounded-lg outline-none font-bold" value={voice} onChange={e => setVoice(e.target.value)}>
              <option value="Zephyr">Zephyr</option>
              <option value="Puck">Puck</option>
              <option value="Kore">Kore</option>
              <option value="Charon">Charon</option>
            </select>
            <button 
              onClick={generateSpeech}
              disabled={loading || !text}
              className="bg-slate-700 text-white font-black py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Synthesizing Audio...' : 'Generate Narrations'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechStudio;