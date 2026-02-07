
import React, { useState } from 'react';
import { UserAccount, SavedSearch, Bookmark, HistoryItem } from '../types';

interface CollectionsViewProps {
  currentUser: UserAccount | null;
  onSearch: (q: string) => void;
  onClose: () => void;
}

const CollectionsView: React.FC<CollectionsViewProps> = ({ currentUser, onSearch, onClose }) => {
  const [tab, setTab] = useState<'bookmarks' | 'searches' | 'history'>('bookmarks');

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <div className="w-full max-w-md p-10 bg-black border-2 border-white/10 rounded-[3rem] text-center space-y-6 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-4xl">🔒</div>
          <h2 className="text-xl font-black text-white uppercase">Vault Locked</h2>
          <p className="text-sm text-gray-500">Anonymous identity required to index collections locally.</p>
          <button onClick={onClose} className="px-8 py-3 bg-[#00ff41] text-black font-black text-[10px] uppercase rounded-full">Return</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl h-[80vh] bg-black border-2 border-white/10 rounded-[3rem] flex flex-col relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white z-20">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-10 border-b border-white/5 space-y-8 bg-black/50 backdrop-blur-xl">
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Private Archive</h2>
           <div className="flex gap-6 border-b border-white/5">
              {[
                { id: 'bookmarks', label: 'Nodes & Bookmarks' },
                { id: 'searches', label: 'Saved Traces' },
                { id: 'history', label: 'Local History' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${tab === t.id ? 'border-[#00ff41] text-[#00ff41]' : 'border-transparent text-gray-600'}`}
                >
                  {t.label}
                </button>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
          {tab === 'bookmarks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.bookmarks.length === 0 && <p className="text-gray-700 uppercase font-black text-xs">No bookmarks indexed.</p>}
              {currentUser.bookmarks.map(b => (
                <div key={b.id} className="p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-[#00ff41]/30 transition-all group">
                  <h4 className="font-black text-sm text-white group-hover:text-[#00ff41] truncate">{b.title}</h4>
                  <p className="text-[10px] font-mono text-gray-600 mt-1 truncate">{b.uri}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[8px] font-black text-gray-800 uppercase">{new Date(b.timestamp).toLocaleDateString()}</span>
                    <a href={b.uri} target="_blank" className="text-[10px] font-black text-[#00ff41] uppercase">Launch Node</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'searches' && (
            <div className="space-y-4">
              {currentUser.savedSearches.length === 0 && <p className="text-gray-700 uppercase font-black text-xs">No search traces saved.</p>}
              {currentUser.savedSearches.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { onSearch(s.query); onClose(); }}
                  className="w-full text-left p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-[#00ff41]/5 hover:border-[#00ff41]/30 transition-all flex justify-between items-center group"
                >
                  <div>
                    <h4 className="font-black text-sm text-white group-hover:text-[#00ff41]">"{s.query}"</h4>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[8px] font-black text-gray-700 uppercase">Mode: {s.mode}</span>
                      <span className="text-[8px] font-black text-gray-700 uppercase">Intent: {s.intent || 'Default'}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-800 group-hover:text-[#00ff41]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-2 opacity-60">
              {currentUser.history.length === 0 && <p className="text-gray-700 uppercase font-black text-xs">History is clean.</p>}
              {currentUser.history.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5 hover:text-white transition-colors cursor-pointer" onClick={() => onSearch(h.query)}>
                  <span className="text-xs font-mono">{h.query}</span>
                  <span className="text-[8px] opacity-40 uppercase">{new Date(h.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsView;
