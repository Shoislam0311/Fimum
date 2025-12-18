'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { MODEL_CONFIGS } from '@/lib/models';
import { ModelMode } from '@/types/chat';

export default function ModelSelector() {
  const { mode, setMode } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = MODEL_CONFIGS[mode];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
      >
        <span className="text-xl">{currentModel.icon}</span>
        <span className="font-medium">{currentModel.label}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-80 bg-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
            {Object.values(MODEL_CONFIGS).map((config) => (
              <button
                key={config.mode}
                onClick={() => {
                  setMode(config.mode as ModelMode);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-start gap-3 px-4 py-3 text-left transition-colors
                  ${mode === config.mode
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700 text-gray-200'
                  }
                `}
              >
                <span className="text-2xl">{config.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{config.label}</div>
                  <div className={`text-sm ${mode === config.mode ? 'text-blue-100' : 'text-gray-400'}`}>
                    {config.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
