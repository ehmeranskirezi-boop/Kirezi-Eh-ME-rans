
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import GroundingSources from './components/GroundingSources';
import FollowUpSuggestions from './components/FollowUpSuggestions';
import AccountPanel from './components/AccountPanel';
import SettingsPanel from './components/SettingsPanel';
import SecurityPath from './components/CircuitVisualization';
import SecuritySandbox from './components/SecuritySandbox';
import IntentPanel from './components/IntentPanel';
import Dashboard from './components/Dashboard';
import NexusAssistant from './components/NexusAssistant';
import { performSearch, interpretSearchIntent } from './services/geminiService';
import { analyzeLinkSafety } from './services/securityAPI';
import { 
  SearchResponse, VisualInput, 
  SearchIntent, UserAccount, 
  UserPreferences, ConnectionNode, SearchSource, SafetyReport, IntentBreakdown, Tab, NexusApp, SearchMode
} from './types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'terminal',
  securityLevel: 'safer',
  isTextOnly: false,
  zoom: 100,
  defaultIntent: 'learn',
  defaultMode: 'all',
  autoDeleteHistory: 'never',
  enableSafeguards: true,
  blockMaliciousSites: true,
  apiProtectionEnabled: true
};

const SIMULATED_PATH: ConnectionNode[] = [
  { label: 'Gateway 01', ip: '194.31.200.12', location: 'Nexus Core', latency: '12ms' },
  { label: 'Neural Relay', ip: '82.165.111.45', location: 'Deep Net', latency: '45ms' }
];

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', query: '', activeApp: 'search', view: 'home', result: null, loading: false, interpreting: false, detectedIntents: [] }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [activePanel, setActivePanel] = useState<'account' | 'settings' | 'launcher' | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const [pathNodes, setPathNodes] = useState<ConnectionNode[]>(SIMULATED_PATH);
  const [activeSandboxSource, setActiveSandboxSource] = useState<SearchSource | null>(null);
  const [activeSafetyReport, setActiveSafetyReport] = useState<SafetyReport | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId)!, [tabs, activeTabId]);
  const preferences = currentUser?.preferences || DEFAULT_PREFERENCES;

  useEffect(() => {
    const saved = localStorage.getItem('nexus_account');
    if (saved) setCurrentUser(JSON.parse(saved));

    const checkApiKey = async () => {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setNeedsApiKey(!hasKey);
      }
    };
    checkApiKey();
  }, []);

  const updateActiveTab = useCallback((updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  }, [activeTabId]);

  const goBack = useCallback(() => {
    if (activeTab.view === 'results') {
      updateActiveTab({ view: 'intent_check' });
    } else if (activeTab.view === 'intent_check') {
      updateActiveTab({ view: 'home', result: null, query: '' });
    }
  }, [activeTab.view, updateActiveTab]);

  const switchApp = (app: NexusApp) => {
    updateActiveTab({ activeApp: app, view: app === 'search' ? 'home' : 'results' });
    setActivePanel(null);
  };

  const startSearchFlow = useCallback(async (query: string, mode?: SearchMode, visualInput?: VisualInput) => {
    if (query.startsWith('/')) {
      const cmd = query.split(' ')[0].substring(1);
      const apps: Record<string, NexusApp> = { maps: 'maps', mail: 'mail', docs: 'docs', photos: 'photos', workspace: 'workspace', media: 'media' };
      if (apps[cmd]) return switchApp(apps[cmd]);
    }

    updateActiveTab({ 
      query, interpreting: true, view: 'intent_check', pendingVisualInput: visualInput,
      title: query.slice(0, 15) || 'Nexus Intelligence'
    });
    
    try {
      const intents = await interpretSearchIntent(query);
      updateActiveTab({ detectedIntents: intents, interpreting: false });
    } catch {
      updateActiveTab({ interpreting: false, view: 'home' });
    }
  }, [updateActiveTab]);

  const confirmIntentAndSearch = useCallback(async (intent: SearchIntent) => {
    updateActiveTab({ loading: true, view: 'results', activeIntent: intent });
    setPathNodes(SIMULATED_PATH.map(n => ({ ...n, latency: `${Math.floor(Math.random()*100)}ms` })));
    try {
      if (needsApiKey && activeTab.activeApp === 'media') {
         await (window as any).aistudio.openSelectKey();
         setNeedsApiKey(false);
      }

      const response = await performSearch(
        activeTab.query, 
        preferences.defaultMode, 
        'standard', 
        intent, 
        preferences.securityLevel, 
        activeTab.pendingVisualInput
      );
      updateActiveTab({ result: response, loading: false });
    } catch {
      updateActiveTab({ loading: false, view: 'home' });
    }
  }, [activeTab, preferences, updateActiveTab, needsApiKey]);

  const handleLaunchSource = async (source: SearchSource) => {
    setActiveSandboxSource(source);
    setActiveSafetyReport(null);
    const report = await analyzeLinkSafety(source.uri, source.title, source.snippet);
    setActiveSafetyReport(report);
  };

  return (
    <div className={`min-h-screen font-mono text-white bg-black selection:bg-[#00ff41] transition-all`}>
      {/* OS Header */}
      <div className="fixed top-0 left-0 right-0 z-[150] bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 h-12 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          {activeTab.view !== 'home' ? (
            <button 
              onClick={goBack} 
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#00ff41]/10 text-[#00ff41] transition-colors"
              title="Navigate Back"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
          ) : (
            <button onClick={() => setActivePanel('launcher')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#00ff41]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
        </div>

        <div className="flex-1 max-w-3xl flex items-center bg-black/50 border border-white/10 rounded-full px-4 h-8 group focus-within:border-[#00ff41]/50 transition-all">
          <input 
            className="flex-1 bg-transparent border-none outline-none text-[10px] text-gray-400 placeholder-gray-700"
            placeholder="Search, commands (/mail, /maps, /workspace), or ask Nexus..."
            value={activeTab.query}
            onChange={(e) => updateActiveTab({ query: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && startSearchFlow(activeTab.query)}
          />
        </div>

        <div className="flex items-center gap-2">
            {needsApiKey && (
              <button 
                onClick={() => (window as any).aistudio.openSelectKey()}
                className="text-[8px] font-black uppercase text-amber-500 border border-amber-500/20 px-2 py-1 rounded-full hover:bg-amber-500/10 transition-all"
              >
                Key Required
              </button>
            )}
            
            <button 
              onClick={() => setActivePanel('settings')} 
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="System Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>

            <button onClick={() => setActivePanel('account')} className="w-8 h-8 rounded-full bg-[#00ff41]/20 border border-[#00ff41]/40 flex items-center justify-center text-[10px] font-black text-[#00ff41]">
              {currentUser ? currentUser.username[0].toUpperCase() : 'ID'}
            </button>
        </div>
      </div>

      <main className="pt-12 min-h-screen overflow-hidden">
        {activeTab.view === 'home' ? (
          <div className="container mx-auto px-6 py-24 space-y-16">
            <Dashboard onAppSwitch={switchApp} onSearch={(q, mode) => startSearchFlow(q, mode)} />
            <div className="max-w-4xl mx-auto">
              <SearchBar 
                onSearch={(q, visual) => startSearchFlow(q, undefined, visual)} 
                isLoading={activeTab.interpreting} 
                isDarkMode={true} 
                initialValue={activeTab.query} 
              />
            </div>
          </div>
        ) : activeTab.view === 'intent_check' ? (
          <div className="container mx-auto px-6 py-20">
            <IntentPanel intents={activeTab.detectedIntents} onConfirm={confirmIntentAndSearch} isLoading={activeTab.loading} />
          </div>
        ) : (
          <div className="container mx-auto px-6 py-10 max-w-7xl flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-8">
              {activeTab.loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6 animate-pulse">
                   <div className="w-16 h-16 border-t-2 border-[#00ff41] rounded-full animate-spin"></div>
                   <p className="text-[#00ff41] text-[10px] uppercase font-black tracking-widest">Compiling Nexus Intelligence...</p>
                </div>
              ) : activeTab.result ? (
                <>
                  <div className="space-y-4 mb-10">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">{activeTab.query}</h2>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-black uppercase bg-[#00ff41]/10 text-[#00ff41] px-3 py-1 rounded-full border border-[#00ff41]/20">AI Subsystem Active</span>
                      {activeTab.pendingVisualInput && <span className="text-[9px] font-black uppercase bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">Visual Context Link</span>}
                    </div>
                  </div>

                  {activeTab.result.generatedMedia && (
                    <div className="rounded-[3rem] overflow-hidden border border-white/10 bg-black mb-8 group relative aspect-video">
                        <img src={activeTab.result.generatedMedia.url} alt="AI Visual" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] font-black uppercase text-[#00ff41]">Generated Asset</p>
                            <p className="text-xs text-gray-300 font-mono mt-2">{activeTab.result.generatedMedia.prompt}</p>
                        </div>
                    </div>
                  )}

                  <ResultCard 
                    answer={activeTab.result.answer} 
                    lastUpdated={activeTab.result.lastUpdated} 
                    transparency={activeTab.result.transparency} 
                  />
                  
                  {activeTab.result.followUpQuestions && activeTab.result.followUpQuestions.length > 0 && (
                    <FollowUpSuggestions questions={activeTab.result.followUpQuestions} onSelect={(q) => startSearchFlow(q)} />
                  )}

                  <GroundingSources sources={activeTab.result.sources} onLaunch={handleLaunchSource} />
                </>
              ) : null}
            </div>
            <aside className="w-full lg:w-72 shrink-0 space-y-8">
               <SecurityPath nodes={pathNodes} />
               <div className="p-8 rounded-[3rem] border border-blue-500/20 bg-blue-500/5 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Cloud Sync</h4>
                  <div className="flex items-center gap-4">
                     <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: '75%'}}></div>
                     </div>
                     <span className="text-[9px] font-mono text-gray-500">75%</span>
                  </div>
                  <p className="text-[8px] text-gray-600 uppercase">Synchronizing workspace snapshots to primary gateway.</p>
               </div>
            </aside>
          </div>
        )}
      </main>

      <NexusAssistant isOpen={assistantOpen} onToggle={() => setAssistantOpen(!assistantOpen)} />
      {activePanel === 'account' && <AccountPanel currentUser={currentUser} setCurrentUser={setCurrentUser} onClose={() => setActivePanel(null)} />}
      {activePanel === 'settings' && <SettingsPanel preferences={preferences} updatePreferences={(p) => currentUser && setCurrentUser({...currentUser, preferences: p})} onClose={() => setActivePanel(null)} />}
      {activeSandboxSource && (
        <SecuritySandbox 
          uri={activeSandboxSource.uri} 
          title={activeSandboxSource.title} 
          report={activeSafetyReport} 
          onClose={() => setActiveSandboxSource(null)}
          onNavigate={() => window.open(activeSandboxSource.uri, '_blank')}
        />
      )}
    </div>
  );
};

export default App;
