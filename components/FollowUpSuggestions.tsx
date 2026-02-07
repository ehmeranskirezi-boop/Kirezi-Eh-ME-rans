
import React from 'react';

interface FollowUpSuggestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({ questions, onSelect }) => {
  if (questions.length === 0) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full"></div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pathway Expansion</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="px-6 py-3 rounded-2xl border border-white/5 bg-white/5 hover:border-[#00ff41]/30 hover:bg-[#00ff41]/5 text-gray-400 hover:text-[#00ff41] text-xs font-mono transition-all group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="opacity-40 group-hover:opacity-100 transition-opacity">{'>'}</span>
              {question}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowUpSuggestions;
