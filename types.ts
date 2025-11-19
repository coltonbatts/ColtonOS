export interface MarkdownFile {
  path: string;
  category: string;
  content: string;
  lastUpdated: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isDraft?: boolean; // If true, this is a suggested markdown update
  relatedFile?: string; // Path to file being discussed or cited
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedFile: MarkdownFile | null;
}

export enum ViewMode {
  CHAT = 'CHAT',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
}