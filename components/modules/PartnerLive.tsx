
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const PartnerLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const sourcesRef = useRef<Set<any>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const stopConversation = () => {
    setIsActive(false);
    setStatus('Finished');
    if (sessionRef.current) {
        // Assume session cleanup
    }
    for (const source of sourcesRef.current) source.stop();
    sourcesRef.current.clear();
  };

  const startConversation = async () => {
    setIsActive(true);
    setStatus('Initializing Connection...');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      audioContextRef.current = outputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a friendly technical advisor for Google Cloud Partners. Speak concisely and helpful.'
        },
        callbacks: {
          onopen: () => setStatus('Live - Listening'),
          onmessage: async (message: any) => {
            const base64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64) {
                const ctx = audioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onerror: (e) => setStatus('Connection Error'),
          onclose: () => setIsActive(false)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Microphone access or API error');
      setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 mb-8 shadow-2xl ${isActive ? 'bg-red-500 scale-110 animate-pulse ring-8 ring-red-100' : 'bg-gray-100 dark:bg-zinc-800'}`}>
        <span className="text-6xl">{isActive ? '🎙️' : '🔘'}</span>
      </div>
      
      <h2 className="text-3xl font-black mb-2 text-gray-800 dark:text-white">Partner Live</h2>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">{status}</p>

      {!isActive ? (
        <button 
          onClick={startConversation}
          className="bg-odoo text-white px-10 py-4 rounded-full font-black text-lg hover:bg-odooDark transition-all active:scale-95 shadow-xl"
        >
          Start Live Consultation
        </button>
      ) : (
        <button 
          onClick={stopConversation}
          className="bg-red-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-red-700 transition-all active:scale-95 shadow-xl"
        >
          End Conversation
        </button>
      )}

      <div className="mt-12 max-w-sm text-gray-400 text-xs italic">
        CloudPilot Live facilitates real-time, zero-latency voice communication with our expert AI. Perfect for hands-free strategy planning.
      </div>
    </div>
  );
};

export default PartnerLive;
