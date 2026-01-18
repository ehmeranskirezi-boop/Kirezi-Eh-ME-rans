
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import GroundingSources from './components/GroundingSources';
import { performSearch } from './services/geminiService';
import { SearchResponse, HistoryItem, SearchMode, SearchTone, SavedSearch, VisualInput } from './types';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const App: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [view, setView] = useState<'home' | 'results'>('home');
  const [mode, setMode] = useState<SearchMode>('all');
  const [tone, setTone] = useState<SearchTone>('standard');
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const howItWorksRef = useRef<HTMLDivElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedH = localStorage.getItem('nexus_search_history');
    const savedS = localStorage.getItem('nexus_saved_searches');
    const savedTheme = localStorage.getItem('nexus_theme');
    
    if (savedH) try { setHistory(JSON.parse(savedH)); } catch (e) {}
    if (savedS) try { setSavedSearches(JSON.parse(savedS)); } catch (e) {}
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('nexus_theme', newMode ? 'dark' : 'light');
  };

  const handleSearch = useCallback(async (rawQuery: string, visualInput?: VisualInput, searchMode: SearchMode = mode, searchTone: SearchTone = tone) => {
    let finalQuery = rawQuery.trim();
    let finalMode = searchMode;
    let finalTone = searchTone;

    const prefixes: Record<string, { mode?: SearchMode; tone?: SearchTone }> = {
      'img:': { mode: 'images' },
      'images:': { mode: 'images' },
      'local:': { mode: 'local' },
      'research:': { mode: 'research' },
      'explain:': { mode: 'explainable' },
      'outcome:': { mode: 'outcome' },
      'temporal:': { mode: 'temporal' },
      'expert:': { mode: 'expert' },
      'bias:': { mode: 'biasAware' },
      'seofree:': { mode: 'seoFree' },
      'personal:': { mode: 'personal' },
      'eli5:': { tone: 'eli5' },
      'academic:': { tone: 'academic' },
      'concise:': { tone: 'concise' },
      'standard:': { tone: 'standard' },
    };

    for (const [prefix, config] of Object.entries(prefixes)) {
      if (finalQuery.toLowerCase().startsWith(prefix)) {
        finalQuery = finalQuery.slice(prefix.length).trim();
        if (config.mode) finalMode = config.mode;
        if (config.tone) finalTone = config.tone;
        break; 
      }
    }

    if (!finalQuery && !visualInput) return;

    setCurrentQuery(finalQuery);
    setLoading(true);
    setView('results');
    setMode(finalMode);
    setTone(finalTone);
    setShowSavedDrawer(false);
    
    let loc = location;
    if (finalMode === 'local' && !location) {
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
      } catch (e) {}
    }

    const response = await performSearch(finalQuery, finalMode, finalTone, loc, visualInput);
    
    if (!response.isError) {
      const newHistory = [
        { query: finalQuery || "Visual Inquiry", mode: finalMode, timestamp: Date.now() },
        ...history.filter(h => h.query !== finalQuery).slice(0, 19)
      ];
      setHistory(newHistory);
      localStorage.setItem('nexus_search_history', JSON.stringify(newHistory));
    }

    setResult(response);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [history, mode, tone, location]);

  const saveSearch = () => {
    if (!currentQuery) return;
    const newSaved = [{ query: currentQuery, mode, timestamp: Date.now() }, ...savedSearches];
    setSavedSearches(newSaved);
    localStorage.setItem('nexus_saved_searches', JSON.stringify(newSaved));
    setShowSavedDrawer(true);
  };

  const resetSearch = () => {
    setView('home');
    setCurrentQuery('');
    setResult(null);
  };

  const getModeStyles = (m: SearchMode) => {
    const base = "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ";
    if (mode !== m) return base + (isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black');
    
    switch(m) {
      case 'research': return base + 'bg-indigo-600 text-white ring-4 ring-indigo-500/20';
      case 'explainable': return base + 'bg-emerald-600 text-white ring-4 ring-emerald-500/20';
      case 'temporal': return base + 'bg-amber-600 text-white ring-4 ring-amber-500/20';
      case 'outcome': return base + 'bg-rose-600 text-white ring-4 ring-rose-500/20';
      case 'expert': return base + 'bg-blue-600 text-white ring-4 ring-blue-500/20';
      case 'seoFree': return base + 'bg-slate-800 text-white ring-4 ring-slate-500/20';
      case 'personal': return base + 'bg-fuchsia-600 text-white ring-4 ring-fuchsia-500/20';
      default: return base + (isDarkMode ? 'bg-white text-black ring-4 ring-white/10' : 'bg-black text-white ring-4 ring-gray-100');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-blue-500/30 font-sans scroll-smooth ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#fcfcfc] text-gray-900'}`}>
      {isLiveActive && <LiveInterface onClose={() => setIsLiveActive(false)} isDarkMode={isDarkMode} />}

      {/* Saved Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[110] w-full max-w-sm shadow-2xl transform transition-transform duration-500 ease-out ${showSavedDrawer ? 'translate-x-0' : 'translate-x-full'} ${isDarkMode ? 'bg-[#111111] border-l border-white/5' : 'bg-white'}`}>
        <div className="flex flex-col h-full">
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
            <h3 className="text-xl font-bold">Saved Library</h3>
            <button onClick={() => setShowSavedDrawer(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {savedSearches.length === 0 ? (
              <div className="text-center py-20 opacity-30">No saved searches</div>
            ) : (
              savedSearches.map((s, i) => (
                <button key={i} onClick={() => handleSearch(s.query, undefined, s.mode)} className={`w-full text-left p-4 rounded-2xl border border-transparent transition-all ${isDarkMode ? 'bg-white/5 hover:border-blue-500/50' : 'bg-gray-50 hover:border-blue-200'}`}>
                  <span className="text-xs font-black uppercase text-blue-500">{s.mode}</span>
                  <p className="font-bold line-clamp-2">{s.query}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${view === 'results' ? (isDarkMode ? 'bg-[#050505]/80 border-b border-white/5' : 'bg-white/80 border-b border-gray-100') + ' backdrop-blur-md py-3' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetSearch}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-white' : 'bg-black'}`}>
              <span className={`font-black text-xl ${isDarkMode ? 'text-black' : 'text-white'}`}>N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Nexus</span>
          </div>
          
          {view === 'results' && (
            <div className="flex-1 max-w-2xl mx-6 hidden md:block">
              <SearchBar onSearch={(q, v) => handleSearch(q, v)} isLoading={loading} initialValue={currentQuery} isDarkMode={isDarkMode} />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}>
              {isDarkMode ? <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
            <button onClick={() => setIsLiveActive(true)} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2">Nexus Live</button>
            <button onClick={() => setShowSavedDrawer(true)} className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg></button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12">
        {view === 'home' ? (
          <div className="container mx-auto px-6 pt-16 lg:pt-24">
            <div className="max-w-4xl mx-auto space-y-12 text-center mb-40">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[1.1]">
                  Discover <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">The Ground Truth.</span>
                </h1>
                <p className={`text-xl max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  AI-native search paradigms designed for high-reasoning accuracy and data transparency.
                </p>
              </div>

              <div className="w-full flex flex-col items-center gap-6">
                <SearchBar onSearch={(q, v) => handleSearch(q, v)} isLoading={loading} isDarkMode={isDarkMode} />
                <div className={`flex flex-wrap justify-center gap-2 p-1 rounded-full backdrop-blur ${isDarkMode ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                  {(['all', 'research', 'explainable', 'expert', 'outcome', 'temporal', 'seoFree', 'personal'] as SearchMode[]).map(m => (
                    <button key={m} onClick={() => setMode(m)} className={getModeStyles(m)}>
                      {m.replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Labs Section */}
            <div ref={labsRef} className={`max-w-6xl mx-auto space-y-24 py-24 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Nexus Labs Paradigms</h2>
                <p className={`max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Paradigms that traditional search engines avoid. Transparency-first, bias-aware, and agent-driven.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <LabCard isDarkMode={isDarkMode} icon="🔍" title="Explainable Search" desc="Every result shows why it ranked, confidence score, and signals used." onClick={() => setMode('explainable')} color="emerald" />
                <LabCard isDarkMode={isDarkMode} icon="🛑" title="SEO-Free Search" desc="Penalizes affiliate spam and AI-generated fluff. Rewards human-first experience." onClick={() => setMode('seoFree')} color="slate" />
                <LabCard isDarkMode={isDarkMode} icon="🗂" title="Life Search" desc="Unify your life: Emails, Notes, PDFs, and Voice Memos in one query." onClick={() => setMode('personal')} color="fuchsia" />
                <LabCard isDarkMode={isDarkMode} icon="🧩" title="Outcome Based" desc="Tutorials, decision matrices, and roadmaps prioritized over clickbait." onClick={() => setMode('outcome')} color="rose" />
                <LabCard isDarkMode={isDarkMode} icon="⏳" title="Temporal Truth" desc="Contrast current data with historical consensus and deprecated info." onClick={() => setMode('temporal')} color="amber" />
                <LabCard isDarkMode={isDarkMode} icon="👥" title="Expert Curated" desc="Results ranked by verified domain credentials and citations." onClick={() => setMode('expert')} color="blue" />
              </div>
            </div>

            {/* Mechanics of Discovery */}
            <div className={`max-w-6xl mx-auto space-y-24 py-24 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
               <div className="text-center space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight">How Nexus Works</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Nexus uses a fully automated process to discover and rank content via Gemini integration.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MechCard isDarkMode={isDarkMode} step="01" title="Crawling" desc="Automated Nexus-bots explore the web regularly to find new and updated pages." icon="🌐" />
                <MechCard isDarkMode={isDarkMode} step="02" title="Indexing" desc="Nexus analyzes content and stores it in a massive database—the Nexus Index." icon="📚" />
                <MechCard isDarkMode={isDarkMode} step="03" title="Ranking" desc="Algorithms sift through billions of points to find relevant, high-quality information." icon="⚡" />
              </div>
            </div>

            {/* 2026 Vision */}
            <div className={`max-w-6xl mx-auto space-y-24 py-24 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
               <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="max-w-2xl space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-indigo-500">2026 Intelligence Leap</h2>
                  <p className="text-gray-500 text-xl leading-relaxed">Transitioning from separate tools to an integrated "intelligence-as-a-service" ecosystem.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailBlock isDarkMode={isDarkMode} title="AI Agents (2026)" desc="Agents manage entire workflows—developing multi-step plans and executing actions across platforms like updating a CRM." />
                <DetailBlock isDarkMode={isDarkMode} title="Maps 2026" desc="Personalized local engines based on your patterns, traits, and real-time foot traffic data." />
                <DetailBlock isDarkMode={isDarkMode} title="Nexus Cloud (GCP)" desc="Powered by 7th-gen Ironwood TPUs and Zero Trust security built into the hardware layer." />
                <DetailBlock isDarkMode={isDarkMode} title="Nexus Workspace" desc="Unified AI search across the organization and ultrasound proximity detection for meeting join." />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 max-w-3xl space-y-6">
                {loading ? (
                  <div className="space-y-8 animate-pulse">
                    <div className={`h-10 w-2/3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}></div>
                    <div className={`h-96 rounded-[2.5rem] ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getModeStyles(mode)}`}>{mode}</div>
                         <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{tone}</div>
                      </div>
                      <button onClick={saveSearch} className="px-4 py-2 rounded-full border border-blue-500/20 text-blue-500 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">Save Result</button>
                    </div>
                    <h2 className="text-4xl font-black leading-tight">{currentQuery || "Visual Inquiry"}</h2>
                    <ResultCard answer={result.answer} transparency={result.transparency} images={result.images} isDarkMode={isDarkMode} />
                  </div>
                ) : null}
              </div>
              <aside className="w-full lg:w-96 space-y-10">
                <div className="sticky top-28">
                  <GroundingSources sources={result?.sources || []} isDarkMode={isDarkMode} />
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <footer className={`mt-32 border-t py-24 transition-colors ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100'}`}>
        <div className="container mx-auto px-6 flex flex-col items-center gap-8">
          <p className="text-gray-400 text-xs font-medium text-center">© 2025 Nexus Search Labs. AI can make mistakes, so double-check responses.</p>
        </div>
      </footer>
    </div>
  );
};

const LabCard = ({ icon, title, desc, onClick, color, isDarkMode }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    slate: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    fuchsia: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20'
  };
  return (
    <button onClick={onClick} className={`p-10 border rounded-[3rem] text-left transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-[#111111] border-white/5 hover:border-white/20' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-2xl border ${colors[color]}`}>{icon}</div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
    </button>
  );
};

const MechCard = ({ title, step, desc, icon, isDarkMode }: any) => (
  <div className={`p-10 border rounded-[3rem] space-y-6 transition-all ${isDarkMode ? 'bg-[#111111] border-white/5 hover:border-indigo-500/50 hover:shadow-xl' : 'bg-white border-gray-100 hover:shadow-xl hover:border-indigo-100'}`}>
    <div className="flex justify-between items-center">
      <div className={`w-12 h-12 text-2xl flex items-center justify-center rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-indigo-50'}`}>{icon}</div>
      <span className={`text-5xl font-black ${isDarkMode ? 'text-white/5' : 'text-gray-100'}`}>{step}</span>
    </div>
    <h3 className="text-2xl font-black">{title}</h3>
    <p className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
  </div>
);

const DetailBlock = ({ title, desc, isDarkMode }: any) => (
  <div className={`p-8 border-l-2 rounded-r-3xl space-y-3 ${isDarkMode ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-indigo-100 bg-indigo-50/20'}`}>
    <h4 className="text-xl font-bold">{title}</h4>
    <p className={`leading-relaxed text-sm lg:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
  </div>
);

const LiveInterface: React.FC<{ onClose: () => void, isDarkMode: boolean }> = ({ onClose, isDarkMode }) => {
  const [status, setStatus] = useState('Connecting...');
  const [transcript, setTranscript] = useState('');
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    let nextStartTime = 0;
    const outputAudioContext = new (window.AudioContext)({sampleRate: 24000});

    const startSession = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const inputAudioContext = new AudioContext({sampleRate: 16000});
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('Listening...');
              const source = inputAudioContext.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                setTranscript(prev => prev + message.serverContent!.outputTranscription!.text);
              }
              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                setStatus('Speaking...');
                nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.start(nextStartTime);
                nextStartTime += audioBuffer.duration;
              }
              if (message.serverContent?.turnComplete) {
                setStatus('Listening...');
              }
            },
            onerror: () => setStatus('Error encountered'),
            onclose: () => setStatus('Connection closed')
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            outputAudioTranscription: {},
            systemInstruction: 'You are Nexus Live. Be helpful, quick, and conversational.'
          }
        });
        sessionRef.current = await sessionPromise;
      } catch (err) {
        setStatus('Permission Denied');
      }
    };

    startSession();
    return () => {
      sessionRef.current?.close();
      outputAudioContext.close();
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 text-white text-center backdrop-blur-3xl transition-colors duration-500 ${isDarkMode ? 'bg-black/90' : 'bg-black/60'}`}>
      <div className="relative mb-12">
        <div className="w-32 h-32 bg-cyan-500 rounded-full blur-2xl animate-pulse absolute inset-0"></div>
        <div className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center relative">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-8 h-8 bg-cyan-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
      <h3 className="text-3xl font-black mb-4 tracking-tight">{status}</h3>
      <div className={`max-w-md p-6 rounded-3xl border mb-8 min-h-[100px] ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'}`}>
        <p className="text-white/60 text-sm italic">{transcript || "Waiting for audio..."}</p>
      </div>
      <button onClick={onClose} className="px-12 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
        End Session
      </button>
    </div>
  );
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}
function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
function createBlob(data: Float32Array): any {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

export default App;
