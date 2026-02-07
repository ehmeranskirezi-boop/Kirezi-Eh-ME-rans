
import React, { useState } from 'react';

interface NexusAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NexusAssistant: React.FC<NexusAssistantProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Nexus Assistant online. How can I optimize your discovery today?' }
  ]);
  const [input, setInput] = useState('');

  return (
    <div className={`fixed bottom-8 right-8 z-[300] transition-all duration-500 ${isOpen ? 'w-80 h-[500px]' : 'w-16 h-16'}`}>
      {!isOpen ? (
        <button 
          onClick={onToggle}
          className="w-16 h-16 rounded-full bg-[#00ff41] text-black flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.4)] hover:scale-110 transition-transform"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      ) : (
        <div className="w-full h-full bg-black border-2 border-[#00ff41]/20 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#00ff41]/5">
            <span className="text-[10px] font-black text-[#00ff41] uppercase tracking-widest">Nexus Assistant</span>
            <button onClick={onToggle} className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[10px] font-medium leading-relaxed ${
                  m.role === 'user' ? 'bg-[#00ff41]/10 text-white' : 'bg-white/5 text-gray-400 border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/5 flex gap-2">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[10px] outline-none focus:border-[#00ff41]"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setMessages([...messages, {role: 'user', text: input}, {role: 'ai', text: 'Processing request...'}])}
            />
            <button className="p-2 text-[#00ff41] hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NexusAssistant;
