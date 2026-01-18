
import React from 'react';
import { SearchSource } from '../types';

interface GroundingSourcesProps {
  sources: SearchSource[];
  isDarkMode?: boolean;
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources, isDarkMode }) => {
  if (sources.length === 0) return null;

  const uniqueSources = sources.filter((s, index, self) =>
    index === self.findIndex((t) => t.uri === s.uri)
  );

  return (
    <div className="w-full">
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 px-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Grounding Sources</h3>
      <div className="flex flex-col gap-3">
        {uniqueSources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 border rounded-xl transition-all group shadow-sm ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30' : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-blue-200'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${source.type === 'maps' ? (isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600') : (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')}`}>
              {source.type === 'maps' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
                </svg>
              )}
            </div>
            <div className="overflow-hidden">
              <span className={`block text-sm font-medium line-clamp-1 ${isDarkMode ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'}`}>
                {source.title}
              </span>
              <span className="block text-xs text-gray-500 truncate uppercase">
                {source.type} • {new URL(source.uri).hostname}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GroundingSources;
