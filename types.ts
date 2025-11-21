export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface SearchSource {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
  sources?: SearchSource[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
