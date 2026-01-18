
import React, { useState, useEffect, useRef } from 'react';
import { VisualInput } from '../types';

interface SearchBarProps {
  onSearch: (query: string, visualInput?: VisualInput) => void;
  isLoading: boolean;
  initialValue?: string;
  isDarkMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialValue = "", isDarkMode }) => {
  const [query, setQuery] = useState(initialValue);
  const [activePrefix, setActivePrefix] = useState<string | null>(null);
  const [visualInput, setVisualInput] = useState<VisualInput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prefixes = [
      'img:', 'images:', 'local:', 'map:', 'place:', 'eli5:', 'academic:', 'concise:', 'std:', 'standard:', 'research:',
      'explain:', 'outcome:', 'temporal:', 'expert:', 'bias:'
    ];
    const lowerQuery = query.toLowerCase();
    const foundPrefix = prefixes.find(p => lowerQuery.startsWith(p));
    setActivePrefix(foundPrefix || null);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || visualInput) {
      onSearch(query.trim(), visualInput || undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisualInput({
          data: reader.result as string,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={visualInput ? "Ask about this image..." : "Ask anything..."}
          className={`w-full pl-14 pr-32 py-4 border rounded-full shadow-sm hover:shadow-md focus:shadow-md focus:outline-none transition-all text-lg font-light ${isDarkMode ? 'bg-[#1a1a1a] text-white border-white/10 focus:border-blue-500' : 'bg-white border-gray-200 text-gray-800 focus:border-blue-400'} ${activePrefix ? 'border-blue-500 ring-2 ring-blue-500/10' : ''}`}
          disabled={isLoading}
        />
        
        {/* Prefix Chip */}
        {activePrefix && (
          <div className="absolute left-14 top-0 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 z-10 animate-in fade-in zoom-in duration-200">
            {activePrefix.replace(':', '')} Mode
          </div>
        )}

        {/* Visual Input Preview */}
        {visualInput && (
          <div className="absolute left-14 bottom-full mb-4 group/preview">
            <div className="relative">
              <img src={visualInput.data} alt="Upload preview" className="w-16 h-16 object-cover rounded-xl border-2 border-blue-500 shadow-xl" />
              <button 
                type="button"
                onClick={() => setVisualInput(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => { setQuery(""); setActivePrefix(null); }}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !visualInput)}
            className={`px-5 py-2 rounded-full font-medium transition-all ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">Thinking</span>
              </div>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
