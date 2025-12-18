'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-end gap-2 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-700 hover:border-gray-600 focus-within:border-blue-500 transition-all shadow-lg">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Fimum..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none resize-none max-h-[200px] px-3 py-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`
            p-2.5 rounded-xl transition-all duration-300 transform
            ${input.trim() && !isLoading
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/50 hover:scale-105 hover:rotate-12'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Fimum can make mistakes. Check important info.
      </p>
    </form>
  );
}
