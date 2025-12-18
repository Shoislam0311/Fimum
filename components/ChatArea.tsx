'use client';

import React, { useEffect, useRef } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import { MODEL_CONFIGS } from '@/lib/models';
import { Sparkles } from 'lucide-react';

export default function ChatArea() {
  const { currentConversation, mode, isLoading, createNewConversation } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const currentModel = MODEL_CONFIGS[mode];

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Fimum</h1>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
        <ModelSelector />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to Fimum
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                Your intelligent AI assistant powered by multiple specialized models
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
                {Object.values(MODEL_CONFIGS).map((config) => (
                  <button
                    key={config.mode}
                    onClick={() => createNewConversation(config.mode)}
                    className="p-6 rounded-xl bg-gray-800 hover:bg-gray-750 transition-all border border-gray-700 hover:border-blue-500 text-left group"
                  >
                    <div className="text-4xl mb-3">{config.icon}</div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                      {config.label}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {config.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {currentConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4 mb-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
