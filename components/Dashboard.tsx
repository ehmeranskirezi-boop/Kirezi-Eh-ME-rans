
import React from 'react';
import { NexusApp, SearchMode } from '../types';

interface DashboardProps {
  onAppSwitch: (app: NexusApp) => void;
  onSearch: (q: string, mode?: SearchMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAppSwitch, onSearch }) => {
  const apps: { id: NexusApp; name: string; icon: string; color: string }[] = [
    { id: 'search', name: 'Search', icon: '🔍', color: '#00ff41' },
    { id: 'workspace', name: 'Workspace', icon: '💼', color: '#10b981' },
    { id: 'maps', name: 'Maps', icon: '🗺️', color: '#f59e0b' },
    { id: 'mail', name: 'Mail', icon: '📧', color: '#3b82f6' },
    { id: 'photos', name: 'Photos', icon: '🖼️', color: '#ec4899' },
    { id: 'media', name: 'Media', icon: '🎥', color: '#ef4444' }
  ];

  const aiModes: { id: SearchMode; name: string; icon: string }[] = [
    { id: 'ai_mode_news', name: 'AI News', icon: '📡' },
    { id: 'ai_mode_images', name: 'AI Image Gen', icon: '✨' },
    { id: 'ai_mode_videos', name: 'AI Video Analysis', icon: '🎬' },
    { id: 'ai_mode_maps', name: 'Spatial AI', icon: '📍' }
  ];

  return (
    <div className="container mx-auto px-6 py-20 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-black uppercase tracking-tighter mb-4">Nexus <span className="text-[#00ff41]">OS</span></h1>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Enterprise Intelligent Ecosystem V5.1</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {apps.map(app => (
          <button 
            key={app.id}
            onClick={() => onAppSwitch(app.id)}
            className="group flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-[#00ff41]/30 hover:bg-[#00ff41]/5 transition-all"
          >
            <div className="text-4xl group-hover:scale-110 transition-transform">{app.icon}</div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">{app.name}</span>
          </button>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ff41] mb-8 text-center">AI Discovery Subsystems</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {aiModes.map(mode => (
              <button 
                key={mode.id}
                onClick={() => onSearch('', mode.id)}
                className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[#00ff41]/40 transition-all hover:bg-[#00ff41]/5 group"
              >
                <div className="text-2xl opacity-60 group-hover:opacity-100">{mode.icon}</div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-white tracking-widest">{mode.name}</div>
                  <div className="text-[8px] text-gray-600 uppercase font-bold mt-1">Enable Mode</div>
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
           </div>
           <h3 className="text-[10px] font-black text-[#00ff41] uppercase tracking-widest">Environment Status</h3>
           <div className="flex items-end gap-4">
             <span className="text-5xl font-black">24°</span>
             <span className="text-xs text-gray-500 font-bold uppercase pb-1">Nexus Core • Optimized</span>
           </div>
           <p className="text-[10px] text-gray-600 leading-relaxed uppercase">Biometric sync stable. No external interference detected in current circuit.</p>
        </div>

        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 space-y-6">
           <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Workflow Index</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center group cursor-pointer">
               <span className="text-xs font-bold uppercase group-hover:text-white">Active Docs</span>
               <span className="text-xs font-black text-blue-500">12</span>
             </div>
             <div className="flex justify-between items-center group cursor-pointer opacity-50 hover:opacity-100">
               <span className="text-xs font-bold uppercase">Pending Mail</span>
               <span className="text-xs font-black text-[#00ff41]">0</span>
             </div>
           </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 space-y-6">
           <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Threat Intelligence</h3>
           <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#00ff41] animate-pulse"></div>
              <span className="text-xs font-black uppercase text-gray-400">Zero active risks</span>
           </div>
           <div className="text-[8px] text-gray-600 font-mono uppercase">
             Last scrub: {new Date().toLocaleTimeString()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
