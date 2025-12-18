'use client';

import React, { useEffect, useRef } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import { MODEL_CONFIGS } from '@/lib/models';
import { Sparkles } from 'lucide-react';

export default function ChatArea() {
  const { currentConversation, isLoading, createNewConversation } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      
      <header className="relative border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-md p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Fimum</h1>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
        <ModelSelector />
      </header>

      <div className="relative flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/50 animate-bounce-slow">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Welcome to Fimum
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl">
                Your intelligent AI assistant powered by multiple specialized models
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
                {Object.values(MODEL_CONFIGS).map((config, index) => (
                  <button
                    key={config.mode}
                    onClick={() => createNewConversation(config.mode)}
                    className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-blue-500 text-left group hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{config.icon}</div>
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
                <div className="flex gap-4 mb-6 animate-fade-in">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles size={16} className="text-white animate-spin-slow" />
                  </div>
                  <div className="bg-gray-800 rounded-2xl px-4 py-3 shadow-lg">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <div className="relative border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-md p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
