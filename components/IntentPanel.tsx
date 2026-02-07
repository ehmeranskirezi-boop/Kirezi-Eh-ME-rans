
import React from 'react';
import { IntentBreakdown, SearchIntent } from '../types';

interface IntentPanelProps {
  intents: IntentBreakdown[];
  onConfirm: (intent: SearchIntent) => void;
  isLoading: boolean;
}

const IntentPanel: React.FC<IntentPanelProps> = ({ intents, onConfirm, isLoading }) => {
  const getIntentIcon = (type: SearchIntent) => {
    switch (type) {
      case 'learn': return '📚';
      case 'find': return '📍';
      case 'compare': return '⚖️';
      case 'verify': return '🛡️';
      default: return '🔍';
    }
  };

  const allIntents: SearchIntent[] = ['learn', 'find', 'compare', 'verify'];

  return (
    <div className="w-full max-w-4xl mx-auto p-10 bg-black border-2 border-[#00ff41]/20 rounded-[3rem] space-y-10 animate-in fade-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(0,255,65,0.05)]">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Intent Interpretation</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Verify signal priority before full circuit decryption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {intents.map((intent, idx) => (
          <button
            key={intent.type}
            disabled={isLoading}
            onClick={() => onConfirm(intent.type)}
            className={`group relative p-8 border-2 rounded-[2.5rem] transition-all text-left overflow-hidden ${
              idx === 0 ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-white/5 bg-white/5 hover:border-white/20'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {idx === 0 && (
              <div className="absolute top-4 right-6 text-[8px] font-black text-[#00ff41] uppercase tracking-widest bg-[#00ff41]/10 px-3 py-1 rounded-full border border-[#00ff41]/20">
                Primary Signal
              </div>
            )}
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                idx === 0 ? 'bg-[#00ff41]/20 text-[#00ff41]' : 'bg-white/5 text-white/40'
              }`}>
                {getIntentIcon(intent.type)}
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-black ${idx === 0 ? 'text-white' : 'text-gray-500'}`}>{intent.label}</h4>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${idx === 0 ? 'bg-[#00ff41]' : 'bg-gray-700'}`} 
                      style={{ width: `${intent.confidence}%` }}
                    ></div>
                  </div>
                  <span className={`text-[10px] font-mono ${idx === 0 ? 'text-[#00ff41]' : 'text-gray-700'}`}>{intent.confidence}%</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5">
        <p className="text-[9px] font-black uppercase text-gray-700 mb-6 tracking-widest text-center">Or Manual Override</p>
        <div className="flex flex-wrap justify-center gap-4">
          {allIntents.filter(t => !intents.find(i => i.type === t)).map(type => (
            <button
              key={type}
              disabled={isLoading}
              onClick={() => onConfirm(type)}
              className="px-6 py-3 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white hover:border-white/20 transition-all"
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="text-center">
           <p className="text-[#00ff41] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Decrypting primary pathway based on intent...</p>
        </div>
      )}
    </div>
  );
};

export default IntentPanel;
