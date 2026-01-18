
import React from 'react';

interface ResultCardProps {
  answer: string;
  images?: string[];
  isDarkMode?: boolean;
  transparency?: {
    confidence: number;
    reasoning: string;
    biasWarning?: string;
  };
}

const ResultCard: React.FC<ResultCardProps> = ({ answer, images, isDarkMode, transparency }) => {
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={`mb-4 leading-relaxed last:mb-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}
      </p>
    ));
  };

  return (
    <div className="space-y-6">
      <div className={`border rounded-[2.5rem] p-8 transition-colors ${isDarkMode ? 'bg-[#111111] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Nexus Insight</h2>
        </div>

        <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : 'prose-blue'}`}>
          {formatText(answer)}
        </div>

        {images && images.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className={`relative group overflow-hidden rounded-2xl shadow-md ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                <img src={img} alt="Generated visual result" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            ))}
          </div>
        )}
      </div>

      {transparency && (
        <div className={`p-8 border rounded-[2.5rem] space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600">Explainable Transparency</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600/60 uppercase">Confidence</span>
              <span className="text-lg font-black text-emerald-600 tabular-nums">{transparency.confidence}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/40 rounded-2xl border border-white/20 text-sm leading-relaxed">
              <span className="font-bold text-emerald-700">Reasoning Chain: </span>
              <span className={isDarkMode ? 'text-gray-300' : 'text-emerald-900/70'}>{transparency.reasoning}</span>
            </div>
            
            {transparency.biasWarning && (
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-sm leading-relaxed flex gap-3">
                <span className="text-lg">⚖️</span>
                <div>
                   <span className="font-bold text-amber-600">Bias Detected: </span>
                   <span className={isDarkMode ? 'text-gray-300' : 'text-amber-900/70'}>{transparency.biasWarning}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
