
export type SearchMode = 
  | 'all' 
  | 'news' 
  | 'video' 
  | 'maps' 
  | 'images' 
  | 'research' 
  | 'explainable' 
  | 'temporal' 
  | 'expert' 
  | 'personal'
  | 'ai_mode_images'
  | 'ai_mode_videos'
  | 'ai_mode_news'
  | 'ai_mode_maps';

export type SearchTone = 'standard' | 'academic' | 'concise' | 'eli5';
export type SecurityLevel = 'standard' | 'safer' | 'safest';
export type SearchIntent = 'learn' | 'find' | 'compare' | 'verify';
export type ThemeMode = 'terminal' | 'dark' | 'light' | 'high-contrast' | 'minimal';

export type NexusApp = 'search' | 'mail' | 'maps' | 'docs' | 'photos' | 'settings' | 'assistant' | 'workspace' | 'media';

export interface Tab {
  id: string;
  title: string;
  query: string;
  activeApp: NexusApp;
  view: 'home' | 'results' | 'intent_check';
  result: SearchResponse | null;
  loading: boolean;
  interpreting: boolean;
  detectedIntents: IntentBreakdown[];
  activeIntent?: SearchIntent;
  pendingVisualInput?: VisualInput;
}

export interface SafetyReport {
  score: number;
  verdict: 'safe' | 'suspicious' | 'malicious' | 'unknown';
  threats: string[];
  recommendation: string;
  analysisTime: string;
}

export interface ConnectionNode {
  label: string;
  ip: string;
  location: string;
  latency: string;
}

export interface UserPreferences {
  theme: ThemeMode;
  securityLevel: SecurityLevel;
  isTextOnly: boolean;
  zoom: number;
  defaultIntent: SearchIntent;
  defaultMode: SearchMode;
  autoDeleteHistory: 'never' | '1day' | 'session';
  enableSafeguards: boolean;
  blockMaliciousSites: boolean;
  apiProtectionEnabled: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  uri: string;
  timestamp: number;
  note?: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  mode: SearchMode;
  intent?: SearchIntent;
}

export interface UserAccount {
  username: string;
  bookmarks: Bookmark[];
  collections: any[];
  savedSearches: SavedSearch[];
  history: HistoryItem[];
  preferences: UserPreferences;
  recoveryKey: string;
}

export interface IntentBreakdown {
  label: string;
  confidence: number;
  type: SearchIntent;
}

export interface SearchSource {
  title: string;
  uri: string;
  type: 'web' | 'maps';
  status: 'online' | 'offline' | 'uncertain';
  safety: 'trusted' | 'risk' | 'scam' | 'neutral' | 'phishing';
  snippet?: string;
  confidence?: number;
  rankingSignals?: string[];
  safetyReport?: SafetyReport;
}

export interface SearchResponse {
  answer: string;
  sources: SearchSource[];
  isError: boolean;
  errorMessage?: string;
  lastUpdated: string;
  followUpQuestions?: string[];
  generatedMedia?: {
    url: string;
    type: 'image' | 'video';
    prompt?: string;
  };
  transparency?: {
    confidence: number;
    reasoning: string;
    consensus?: string;
  };
}

export interface HistoryItem {
  query: string;
  mode: SearchMode;
  timestamp: number;
}

export interface Suggestion {
  text: string;
  type: 'mode' | 'topic' | 'history' | 'news' | 'trending';
  icon?: string;
}

export interface VisualInput {
  data: string; // base64
  mimeType: string;
}

export interface TimelineEvent {
  event: string;
  timestamp: string;
  status: 'verified' | 'updated' | 'pending' | 'other';
}

export interface TemporalAnalysis {
  pastConsensus: string;
  currentKnowledge: string;
  deprecatedInfo: string[];
  timeline: {
    period: string;
    consensus: string;
    isDeprecated: boolean;
  }[];
}

export interface PersonalKnowledgeEntry {
  type: 'email' | 'note' | 'pdf' | 'message';
  title: string;
  date: string;
  content: string;
  source: string;
}

export interface SafeguardEvent {
  id: string;
  type: string;
  timestamp: number;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}
