
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';

// Decoding/Encoding helpers as required by the guidelines
function decode(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
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

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const PartnerLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopConversation = () => {
    setIsActive(false);
    setStatus('Finished');
    if (sessionRef.current) {
        sessionRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    for (const source of sourcesRef.current) source.stop();
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const startConversation = async () => {
    setIsActive(true);
    setStatus('Initializing Connection...');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a friendly technical advisor for Google Cloud Partners. Speak concisely and helpful.'
        },
        callbacks: {
          onopen: () => {
            setStatus('Live - Listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64) {
                const ctx = outputAudioContextRef.current!;
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

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) source.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setStatus('Connection Error');
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Closed');
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Microphone access or API error');
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);

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
          className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-indigo-700 transition-all active:scale-95 shadow-xl"
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
