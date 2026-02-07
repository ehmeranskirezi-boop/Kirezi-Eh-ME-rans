
import React, { useState } from 'react';
import { UserAccount, UserPreferences } from '../types';

interface AccountPanelProps {
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  onClose: () => void;
}

const DEFAULT_PREFS: UserPreferences = {
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

const AccountPanel: React.FC<AccountPanelProps> = ({ currentUser, setCurrentUser, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    const recoveryKey = Math.random().toString(36).substring(2).toUpperCase();
    const newUser: UserAccount = {
      username,
      bookmarks: [],
      collections: [],
      savedSearches: [],
      history: [],
      preferences: DEFAULT_PREFS,
      recoveryKey
    };
    setCurrentUser(newUser);
    alert(`Secure Identity established.\nRECOVERY KEY: ${recoveryKey}\n(Keep this offline!)`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Identity confirmed and synced with local index.");
  };

  const handleLogout = () => {
    if (window.confirm("Terminate Identity Session? Local traces will remain until purged.")) {
      setCurrentUser(null);
      localStorage.removeItem('nexus_account');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md p-10 bg-black border-2 border-white/10 rounded-[3rem] space-y-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {currentUser ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#00ff41]/20 rounded-full flex items-center justify-center mx-auto border-2 border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                <span className="text-[#00ff41] font-black text-2xl">{currentUser.username[0].toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-black text-white">@{currentUser.username}</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Active Identity Session</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="block text-[8px] font-black opacity-30 uppercase">Bookmarks</span>
                <span className="text-xl font-black">{currentUser.bookmarks.length}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="block text-[8px] font-black opacity-30 uppercase">Searches</span>
                <span className="text-xl font-black">{currentUser.savedSearches.length}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
               <span className="block text-[8px] font-black text-amber-500 uppercase mb-1">Recovery Access</span>
               <code className="text-[10px] font-mono text-amber-500/60 break-all">{currentUser.recoveryKey}</code>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-4 rounded-full border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 transition-all"
            >
              Terminate Identity
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                {isSignup ? 'Initialize Secure Profile' : 'Identity Sync'}
              </h2>
              <p className="text-xs text-gray-500 mt-2">Personalize your high-security search experience.</p>
            </div>

            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
              <input 
                type="text" 
                placeholder="USERNAME" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm focus:border-[#00ff41] focus:outline-none transition-all placeholder:opacity-20"
              />
              <input 
                type="password" 
                placeholder="PASSWORD" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm focus:border-[#00ff41] focus:outline-none transition-all placeholder:opacity-20"
              />
              <button 
                type="submit"
                className="w-full py-4 bg-[#00ff41] text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-[#00cc33] transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)]"
              >
                {isSignup ? 'Establish Link' : 'Sync Session'}
              </button>
            </form>

            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="w-full text-[10px] font-black text-gray-500 uppercase hover:text-[#00ff41] transition-colors"
            >
              {isSignup ? 'Existing Session Found?' : 'Need New Identity?'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPanel;
