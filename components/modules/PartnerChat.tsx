
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const PartnerChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are an Odoo and GCP expert consultant. Speak in a professional but helpful tone.'
        }
      });
      setMessages(prev => [...prev, {role: 'bot', text: response.text || 'Thinking...' }]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'bot', text: 'Sorry, I encountered an error.'}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border dark:border-zinc-700 overflow-hidden">
      <div className="p-6 border-b dark:border-zinc-700 flex items-center gap-3">
         <div className="w-3 h-3 bg-green-500 rounded-full"></div>
         <h2 className="font-black text-gray-800 dark:text-white uppercase tracking-widest text-sm">Partner Chatroom</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-zinc-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm font-medium leading-relaxed ${
              m.role === 'user' 
              ? 'bg-odoo text-white rounded-tr-none' 
              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-tl-none border dark:border-zinc-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 animate-pulse font-bold italic">Advisor is typing...</div>}
      </div>

      <div className="p-6 border-t dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <div className="flex gap-4">
          <input 
            className="flex-1 p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white rounded-xl outline-none border dark:border-zinc-700 focus:ring-2 focus:ring-odoo transition-all font-medium"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-odoo text-white px-6 py-4 rounded-xl font-black shadow-lg shadow-purple-100 dark:shadow-none transition-all active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerChat;
