
import React from 'react';
import { TemporalAnalysis } from '../types';

interface TemporalTruthViewProps {
  analysis: TemporalAnalysis;
  isDarkMode?: boolean;
}

const TemporalTruthView: React.FC<TemporalTruthViewProps> = ({ analysis, isDarkMode }) => {
  return (
    <div className={`rounded-[2.5rem] p-8 border ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'} space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-amber-400' : 'text-amber-900'}`}>Temporal Truth Analysis</h2>
          <p className="text-xs opacity-60">Tracing the evolution of consensus over time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Past Consensus</h3>
          <p className={`text-sm leading-relaxed opacity-80 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {analysis.pastConsensus}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-green-500">Current Knowledge</h3>
          <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {analysis.currentKnowledge}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-red-500">Deprecated Information Warning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.deprecatedInfo.map((info, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-4 rounded-2xl border ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-red-100/50 border-red-200 text-red-800'}`}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-bold">{info}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-40">Historical Timeline</h3>
        <div className="flex flex-col gap-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-200/20">
          {analysis.timeline.map((point, idx) => (
            <div key={idx} className="relative flex items-center gap-6 pl-10">
              <div className={`absolute left-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${point.isDeprecated === false ? 'border-green-500' : 'border-gray-400'}`}>
                {point.isDeprecated === false && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black opacity-40">{point.period}</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{point.consensus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemporalTruthView;
