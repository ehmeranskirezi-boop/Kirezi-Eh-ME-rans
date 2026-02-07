
import React from 'react';
import { SearchSource } from '../types';

interface GroundingSourcesProps {
  sources: SearchSource[];
  isDarkMode?: boolean;
  onLaunch?: (source: SearchSource) => void;
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources, isDarkMode, onLaunch }) => {
  if (sources.length === 0) return (
    <div className="p-12 border-2 border-dashed border-red-500/20 rounded-[3rem] text-center bg-red-500/5">
      <p className="text-red-500 font-mono text-xs uppercase font-black">Warning: No Verified Resources Found for this Query</p>
      <p className="text-gray-600 text-[10px] mt-2 uppercase">Possible connectivity issues or restrictive security filters.</p>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center px-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00ff41]">Verified Sources & Connections</h3>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{sources.length} Verified Entries</span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {sources.map((source, index) => (
          <div
            key={index}
            className={`p-8 border-2 rounded-[3rem] transition-all group relative overflow-hidden bg-black ${
              source.safety === 'phishing' ? 'border-red-600 bg-red-600/5' :
              source.safety === 'risk' ? 'border-amber-500/30' : 
              'border-white/5 hover:border-blue-500/40'
            }`}
          >
            <div className="flex flex-col gap-6">
              {source.safety === 'phishing' && (
                <div className="flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase animate-pulse">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Safeguard Alert: Detected high-risk resource profile.
                </div>
              )}

              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                    source.safety === 'trusted' ? 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {source.safety === 'trusted' ? '🛡️' : '🌐'}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-base font-black truncate group-hover:text-[#00ff41] transition-colors ${source.safety === 'phishing' ? 'text-red-400' : 'text-white'}`}>
                        {source.title}
                    </h4>
                    <p className="text-[11px] font-mono text-gray-500 truncate mt-0.5 break-all">{source.uri}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                    source.status === 'online' ? 'bg-[#00ff41]/10 text-[#00ff41] border-[#00ff41]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {source.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex flex-wrap gap-2">
                  {source.rankingSignals?.map((sig, i) => (
                    <span key={i} className="text-[8px] font-black uppercase text-gray-600 bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                      {sig}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="block text-[8px] font-black text-gray-700 uppercase">Trust Score</span>
                        <span className="text-xs font-black text-[#00ff41]">{source.confidence}%</span>
                    </div>
                    <button 
                      onClick={() => onLaunch?.(source)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00ff41]/20 hover:border-[#00ff41] border border-transparent transition-all"
                    >
                        <svg className="w-4 h-4 text-[#00ff41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroundingSources;
