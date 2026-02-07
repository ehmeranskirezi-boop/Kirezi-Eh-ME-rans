
import React, { useState, useEffect, useRef } from 'react';
import { VisualInput, Suggestion } from '../types';
import { getSuggestions } from '../services/geminiService';

interface SearchBarProps {
  onSearch: (query: string, visualInput?: VisualInput) => void;
  isLoading: boolean;
  initialValue?: string;
  isDarkMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialValue = "", isDarkMode }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [visualInput, setVisualInput] = useState<VisualInput | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 2) {
        const results = await getSuggestions(query.trim());
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisualInput({ data: reader.result as string, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() || visualInput) {
      setShowSuggestions(false);
      onSearch(query.trim(), visualInput || undefined);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setQuery(suggestionText);
    onSearch(suggestionText);
    setShowSuggestions(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-3xl relative mx-auto"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <form onSubmit={handleSubmit} className="relative group z-10">
        <div className={`relative transition-all duration-300 ${isDragging ? 'scale-[1.02]' : ''}`}>
          <div className={`absolute left-6 top-1/2 -translate-y-1/2 font-black text-lg transition-colors ${isDragging ? 'text-[#00ff41]' : 'text-[#00ff41] opacity-40'}`}>
            {isDragging ? '↓' : '>'}
          </div>
          <input
            type="text"
            value={query}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isLoading ? "DECRYPTING..." : 
              isDragging ? "DROP IMAGE HERE..." :
              visualInput ? "DESCRIBE IMAGE CONTEXT..." : 
              "ENTER COMMAND OR QUERY..."
            }
            className={`w-full pl-12 pr-40 py-6 bg-black border-2 rounded-full text-white font-mono text-lg focus:outline-none transition-all placeholder:text-gray-800 ${
              isDragging ? 'border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)]' : 'border-white/10 focus:border-[#00ff41]'
            }`}
            disabled={isLoading}
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {visualInput && (
              <div className="relative group animate-in zoom-in-75 duration-300">
                <img 
                  src={visualInput.data} 
                  alt="Visual Signal" 
                  className="w-10 h-10 rounded-lg object-cover border border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.3)] animate-pulse" 
                />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setVisualInput(null); }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-700 transition-colors shadow-lg"
                >
                  ×
                </button>
              </div>
            )}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-2 rounded-full transition-all duration-300 ${visualInput ? 'text-[#00ff41] scale-110' : 'text-gray-700 hover:text-[#00ff41] hover:bg-white/5'}`}
              title="Upload Visual Signal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
            />
            <button 
              type="submit" 
              className={`bg-[#00ff41] hover:bg-[#00cc33] text-black font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,65,0.3)] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {visualInput ? 'Scan' : 'Execute'}
            </button>
          </div>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-black border-2 border-white/10 rounded-[2rem] overflow-hidden z-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-2 duration-300">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSuggestionClick(s.text)}
              className="w-full text-left px-8 py-4 hover:bg-[#00ff41]/5 flex items-center gap-4 group transition-colors border-b border-white/5 last:border-0"
            >
              <span className="text-gray-700 group-hover:text-[#00ff41] transition-colors">{s.icon || '🔍'}</span>
              <span className="text-sm font-mono text-gray-400 group-hover:text-white transition-colors">{s.text}</span>
              <span className="ml-auto text-[8px] font-black text-gray-800 uppercase group-hover:text-gray-600">{s.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
