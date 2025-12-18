export type ModelMode = 'normal' | 'coding' | 'study' | 'thinking' | 'research';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode?: ModelMode;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  mode: ModelMode;
  createdAt: number;
  updatedAt: number;
}

export interface ModelConfig {
  mode: ModelMode;
  model: string | string[];
  label: string;
  description: string;
  icon: string;
}
