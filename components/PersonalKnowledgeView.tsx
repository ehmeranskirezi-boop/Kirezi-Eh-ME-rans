
import React from 'react';
import { PersonalKnowledgeEntry } from '../types';

interface PersonalKnowledgeViewProps {
  entries: PersonalKnowledgeEntry[];
  isDarkMode?: boolean;
}

const PersonalKnowledgeView: React.FC<PersonalKnowledgeViewProps> = ({ entries, isDarkMode }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      case 'note': return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
      case 'pdf': return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
      case 'message': return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
      default: return null;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'email': return 'text-blue-500 bg-blue-500/10';
      case 'note': return 'text-yellow-500 bg-yellow-500/10';
      case 'pdf': return 'text-red-500 bg-red-500/10';
      case 'message': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Private Knowledge Matches</h3>
        <span className="text-[10px] font-bold text-indigo-500 uppercase">Encrypted Session</span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {entries.map((entry, idx) => (
          <div key={idx} className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl shrink-0 ${getColorClass(entry.type)}`}>
                {getIcon(entry.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{entry.title}</h4>
                  <span className="text-[10px] opacity-40 font-bold whitespace-nowrap ml-2">{entry.date}</span>
                </div>
                <p className={`text-xs leading-relaxed line-clamp-2 mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {entry.content}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                    {entry.source}
                  </span>
                  <span className={`text-[9px] font-black uppercase text-indigo-500`}>Direct Context Match</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalKnowledgeView;
