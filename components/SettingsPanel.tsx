
import React from 'react';
import { UserPreferences, ThemeMode, SecurityLevel, SearchIntent, SearchMode } from '../types';

interface SettingsPanelProps {
  preferences: UserPreferences;
  updatePreferences: (p: UserPreferences) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ preferences, updatePreferences, onClose }) => {
  const themes: ThemeMode[] = ['terminal', 'dark', 'light', 'high-contrast', 'minimal'];
  const securityLevels: SecurityLevel[] = ['standard', 'safer', 'safest'];
  const intents: SearchIntent[] = ['learn', 'find', 'compare', 'verify'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl p-10 bg-black border-2 border-white/10 rounded-[3rem] space-y-10 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Configuration</h2>
          <p className="text-xs text-gray-500">Tailor the indexing experience to your node profile.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#00ff41] tracking-widest">Interface Skin</h3>
              <div className="flex flex-wrap gap-2">
                {themes.map(t => (
                  <button 
                    key={t}
                    onClick={() => updatePreferences({...preferences, theme: t})}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${preferences.theme === t ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5' : 'border-white/5 text-gray-600 hover:border-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#00ff41] tracking-widest">Optical Zoom ({preferences.zoom}%)</h3>
              <input 
                type="range" min="10" max="200" step="5"
                value={preferences.zoom}
                onChange={(e) => updatePreferences({...preferences, zoom: parseInt(e.target.value)})}
                className="w-full h-1 bg-gray-900 rounded-full appearance-none cursor-pointer accent-[#00ff41]"
              />
              <div className="flex justify-between text-[8px] font-black opacity-30 uppercase">
                <span>Micro (10%)</span>
                <span>Macro (200%)</span>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#00ff41] tracking-widest">Default Intent</h3>
              <div className="grid grid-cols-2 gap-2">
                {intents.map(i => (
                  <button 
                    key={i}
                    onClick={() => updatePreferences({...preferences, defaultIntent: i})}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${preferences.defaultIntent === i ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5' : 'border-white/5 text-gray-600'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#00ff41] tracking-widest">Behavioral Policy</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={preferences.isTextOnly}
                    onChange={(e) => updatePreferences({...preferences, isTextOnly: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-[#00ff41]"
                  />
                  <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white transition-colors">Force Zero-JS Text Mode</span>
                </label>
                <div className="pt-4 border-t border-white/5">
                  <span className="text-[8px] font-black text-gray-700 uppercase">Auto-Purge History</span>
                  <select 
                    value={preferences.autoDeleteHistory}
                    onChange={(e) => updatePreferences({...preferences, autoDeleteHistory: e.target.value as any})}
                    className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black uppercase text-white outline-none focus:border-[#00ff41]"
                  >
                    <option value="never">Retain Forever</option>
                    <option value="1day">Clear after 24H</option>
                    <option value="session">Clear on Session Exit</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all border border-white/10"
        >
          Commit Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
