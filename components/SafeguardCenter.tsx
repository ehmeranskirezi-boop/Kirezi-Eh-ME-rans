
import React from 'react';
import { SafeguardEvent } from '../types';

interface SafeguardCenterProps {
  events: SafeguardEvent[];
  onClose: () => void;
}

const SafeguardCenter: React.FC<SafeguardCenterProps> = ({ events, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-2xl bg-black border-2 border-[#00ff41]/20 rounded-[3rem] overflow-hidden flex flex-col h-[70vh] shadow-[0_0_50px_rgba(0,255,65,0.1)]">
        <div className="p-8 border-b border-[#00ff41]/10 flex justify-between items-center bg-[#00ff41]/5">
           <div>
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Safeguard Command Center</h2>
             <p className="text-[10px] text-[#00ff41] font-black uppercase tracking-widest mt-1">Real-time threat interception log</p>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
               <div className="w-16 h-16 rounded-full border-2 border-[#00ff41] flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-[#00ff41]/20"></div>
               </div>
               <p className="text-xs font-black uppercase tracking-widest">No Active Threats Detected in this Circuit</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={`p-6 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                event.severity === 'critical' || event.severity === 'high' ? 'border-red-600/30 bg-red-600/5' : 'border-amber-500/30 bg-amber-500/5'
              }`}>
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  event.severity === 'critical' || event.severity === 'high' ? 'bg-red-600' : 'bg-amber-500'
                } animate-pulse`}></div>
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[10px] font-black uppercase text-white">{event.type.replace('_', ' ')}</h4>
                      <span className="text-[8px] font-mono opacity-40 uppercase">{new Date(event.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <p className="text-xs text-gray-400 font-medium leading-relaxed">{event.description}</p>
                   <div className="mt-4 flex gap-3">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                        event.severity === 'critical' || event.severity === 'high' ? 'bg-red-600/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>SEVERITY: {event.severity}</span>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-white/5 text-gray-500">Intercepted & Blocked</span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase opacity-40">
           <span>Protected by Nexus Safeguard Engine V4.2</span>
           <span className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full"></div>
             Active Protection
           </span>
        </div>
      </div>
    </div>
  );
};

export default SafeguardCenter;
