import { ModelConfig } from '@/types/chat';

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  normal: {
    mode: 'normal',
    model: 'nvidia/nemotron-nano-12b-v2-vl:free',
    label: 'Normal Chat',
    description: 'General conversation and questions',
    icon: '💬',
  },
  coding: {
    mode: 'coding',
    model: 'mistralai/devstral-2512:free',
    label: 'Coding',
    description: 'Programming and development help',
    icon: '💻',
  },
  study: {
    mode: 'study',
    model: 'allenai/olmo-3.1-32b-think:free',
    label: 'Study',
    description: 'Learning and educational content',
    icon: '📚',
  },
  thinking: {
    mode: 'thinking',
    model: [
      'allenai/olmo-3.1-32b-think:free',
      'nvidia/nemotron-3-nano-30b-a3b:free'
    ],
    label: 'Thinking',
    description: 'Deep reasoning and analysis',
    icon: '🧠',
  },
  research: {
    mode: 'research',
    model: 'nvidia/nemotron-3-nano-30b-a3b:free',
    label: 'Deep Research',
    description: 'In-depth research and exploration',
    icon: '🔬',
  },
};

export function getModelForMode(mode: string): string | string[] {
  return MODEL_CONFIGS[mode]?.model || MODEL_CONFIGS.normal.model;
}
