
import React from 'react';
import { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
  isDarkMode?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ events, isDarkMode }) => {
  return (
    <div className="space-y-4">
      <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Artifact Lifecycle</h3>
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-blue-500/50 before:to-transparent">
        {events.map((event, idx) => (
          <div key={idx} className="relative flex items-center gap-4 pl-8 group">
            <div className={`absolute left-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              event.status === 'verified' ? 'bg-blue-500 border-blue-500' :
              event.status === 'updated' ? 'bg-green-500 border-green-500' :
              event.status === 'pending' ? 'bg-yellow-500 border-yellow-500' :
              'bg-gray-400 border-gray-400'
            }`}>
              {event.status === 'verified' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              {event.status === 'updated' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
            </div>
            <div className={`flex flex-col ${isDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
              <span className="text-xs font-bold leading-none mb-1">{event.event}</span>
              <span className="text-[10px] opacity-40 font-mono tracking-tighter">{event.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
