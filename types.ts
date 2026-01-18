
export type SearchMode = 'all' | 'local' | 'images' | 'research' | 'live' | 'explainable' | 'outcome' | 'temporal' | 'expert' | 'biasAware' | 'seoFree' | 'personal';
export type SearchTone = 'standard' | 'academic' | 'concise' | 'eli5';

export interface SearchSource {
  title: string;
  uri: string;
  type: 'web' | 'maps';
  snippet?: string;
}

export interface SearchResponse {
  answer: string;
  sources: SearchSource[];
  images?: string[];
  isError: boolean;
  errorMessage?: string;
  transparency?: {
    confidence: number;
    reasoning: string;
    biasWarning?: string;
  };
}

export interface HistoryItem {
  query: string;
  mode: SearchMode;
  timestamp: number;
}

export interface SavedSearch {
  query: string;
  mode: SearchMode;
  timestamp: number;
}

export interface SearchSettings {
  tone: SearchTone;
}

export interface VisualInput {
  data: string; // base64
  mimeType: string;
}
