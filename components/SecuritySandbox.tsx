
import React, { useState, useEffect } from 'react';
import { SafetyReport } from '../types';

interface SecuritySandboxProps {
  uri: string;
  title: string;
  report: SafetyReport | null;
  onClose: () => void;
  onNavigate: () => void;
}

const SecuritySandbox: React.FC<SecuritySandboxProps> = ({ uri, title, report, onClose, onNavigate }) => {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!report) {
      const interval = setInterval(() => {
        setScanProgress(p => (p < 95 ? p + Math.random() * 15 : p));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setScanProgress(100);
    }
  }, [report]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <div className="w-full max-w-2xl bg-black border-2 border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]">
        <div className="p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                !report ? 'bg-white/5 animate-pulse' : 
                report.verdict === 'safe' ? 'bg-[#00ff41]/20 text-[#00ff41]' : 
                report.verdict === 'suspicious' ? 'bg-amber-500/20 text-amber-500' : 
                'bg-red-600/20 text-red-600'
              }`}>
                {!report ? '🛡️' : report.verdict === 'safe' ? '✅' : report.verdict === 'suspicious' ? '⚠️' : '🚫'}
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">Security Sandbox</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Protocol: Resource Analysis</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-2">
            <p className="text-[10px] font-black uppercase text-gray-600">Target Resource</p>
            <p className="text-sm font-black text-white truncate">{title}</p>
            <p className="text-[10px] font-mono text-gray-500 truncate">{uri}</p>
          </div>

          {!report ? (
            <div className="space-y-4 py-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase text-[#00ff41] animate-pulse">Scanning for malicious payloads...</span>
                <span className="text-xs font-mono text-[#00ff41]">{Math.floor(scanProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                <div className="h-full bg-[#00ff41] transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-gray-800 uppercase">Analyzing Host Reputation... OK</span>
                <span className="text-[8px] font-mono text-gray-800 uppercase">Checking SSL Transparency... OK</span>
                <span className="text-[8px] font-mono text-gray-800 uppercase">Searching Threat Databases... OK</span>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase opacity-40">Safety Index</span>
                  <div className="text-3xl font-black text-white">{report.score}<span className="text-xs opacity-20">/100</span></div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase opacity-40">Risk Verdict</span>
                  <div className={`text-xl font-black uppercase ${
                    report.verdict === 'safe' ? 'text-[#00ff41]' : 
                    report.verdict === 'suspicious' ? 'text-amber-500' : 
                    'text-red-600'
                  }`}>{report.verdict}</div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-gray-600">Threat Intelligence</span>
                <div className="flex flex-wrap gap-2">
                  {report.threats.length === 0 ? (
                    <span className="text-[10px] font-black text-[#00ff41] uppercase bg-[#00ff41]/5 px-3 py-1 rounded-full">Zero known threats</span>
                  ) : (
                    report.threats.map((t, i) => (
                      <span key={i} className="text-[10px] font-black text-red-500 uppercase bg-red-500/5 px-3 py-1 rounded-full border border-red-500/10">{t}</span>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-blue-400 mb-2">Nexus Protection Recommendation</p>
                <p className="text-xs text-blue-200/70 leading-relaxed font-medium">{report.recommendation}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 rounded-full border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Abort Access
                </button>
                <button 
                  onClick={onNavigate}
                  className={`flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                    report.verdict === 'malicious' ? 'bg-red-600 text-white animate-pulse' : 'bg-[#00ff41] text-black hover:bg-[#00cc33]'
                  }`}
                >
                  Proceed {report.verdict === 'malicious' ? 'at Risk' : 'to Resource'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white/5 p-4 text-center border-t border-white/5">
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Powered by Nexus Security API V4.0 • Verified at {report?.analysisTime || "Analysis Point"}</span>
        </div>
      </div>
    </div>
  );
};

export default SecuritySandbox;
