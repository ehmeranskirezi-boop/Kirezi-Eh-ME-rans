
import React, { useState } from 'react';

interface ResultCardProps {
  answer: string;
  isDarkMode?: boolean;
  lastUpdated: string;
  transparency?: {
    confidence: number;
    reasoning: string;
    consensus?: string;
  };
  onBookmark?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ answer, isDarkMode, lastUpdated, transparency, onBookmark }) => {
  const [showMeta, setShowMeta] = useState(false);

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      if (trimmed.startsWith('Key Aspects:') || trimmed.startsWith('In essence,')) {
        return <h3 key={i} className="text-lg font-black mt-8 mb-4 text-[#00ff41] uppercase tracking-widest">{trimmed}</h3>;
      }
      
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return <li key={i} className="ml-5 mb-3 list-disc text-gray-400 text-sm leading-relaxed">{trimmed.substring(1).trim()}</li>;
      }

      return (
        <p key={i} className="mb-6 leading-relaxed text-gray-300 text-base font-medium">
          {trimmed.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-black">$1</span>')}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[3rem] p-8 border-2 border-white/5 bg-black relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <svg className="w-48 h-48 text-[#00ff41]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
        </div>
        
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff41]/60">Decrypted Overview</span>
            </div>
            <div className="text-[9px] font-mono text-gray-600 flex items-center gap-4">
              <span>ID: {Math.random().toString(16).substring(2, 8).toUpperCase()}</span>
            </div>
        </div>

        <div className="prose max-w-none prose-invert">
             {formatText(answer)}
        </div>

        {showMeta && transparency && (
            <div className="mt-12 p-8 rounded-[2rem] bg-white/5 border border-white/10 animate-in slide-in-from-top-4 duration-500">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00ff41] mb-6">Truth Matrix Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase opacity-40">Grounding Source</span>
                        <p className="text-xs text-gray-400 leading-relaxed">{transparency.reasoning}</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase opacity-40">Confidence Score</span>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-black text-[#00ff41]">{transparency.confidence}%</span>
                            <div className="flex-1 h-1 bg-gray-900 rounded-full">
                                <div className="h-full bg-[#00ff41]" style={{width: `${transparency.confidence}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
            <button 
                onClick={() => setShowMeta(!showMeta)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#00ff41] transition-colors flex items-center gap-2"
            >
                {showMeta ? 'Hide Trace Data' : 'View Trace Data'}
                <svg className={`w-3 h-3 transition-transform ${showMeta ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"></span>
                    <span className="text-[9px] font-black text-gray-600 uppercase">Verified Index</span>
                </div>
                <span className="text-[9px] font-mono text-gray-700">{lastUpdated}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
