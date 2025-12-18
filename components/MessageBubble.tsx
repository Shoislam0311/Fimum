'use client';

import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Message } from '@/types/chat';
import { User, Sparkles, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = !isUser && message.content.includes('⚠️ **Error**');

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isError 
            ? 'bg-gradient-to-br from-red-500 to-orange-600' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}>
          {isError ? <AlertCircle size={16} className="text-white" /> : <Sparkles size={16} className="text-white" />}
        </div>
      )}
      
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : isError
            ? 'bg-red-900/30 text-gray-100 border border-red-600/50'
            : 'bg-gray-800 text-gray-100'
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <Markdown
              options={{
                overrides: {
                  pre: {
                    component: ({ children, ...props }) => (
                      <pre {...props} className="bg-gray-900/80 p-4 rounded-lg overflow-x-auto my-3 border border-gray-700">
                        {children}
                      </pre>
                    ),
                  },
                  code: {
                    component: ({ children, ...props }) => (
                      <code {...props} className="bg-gray-900/60 px-2 py-0.5 rounded text-blue-300 font-mono text-sm">
                        {children}
                      </code>
                    ),
                  },
                  a: {
                    component: ({ children, ...props }) => (
                      <a {...props} className="text-blue-400 hover:text-blue-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  },
                  h1: {
                    component: ({ children, ...props }) => (
                      <h1 {...props} className="text-2xl font-bold text-white mt-4 mb-2">{children}</h1>
                    ),
                  },
                  h2: {
                    component: ({ children, ...props }) => (
                      <h2 {...props} className="text-xl font-semibold text-white mt-3 mb-2">{children}</h2>
                    ),
                  },
                  h3: {
                    component: ({ children, ...props }) => (
                      <h3 {...props} className="text-lg font-semibold text-white mt-2 mb-1">{children}</h3>
                    ),
                  },
                  ul: {
                    component: ({ children, ...props }) => (
                      <ul {...props} className="list-disc list-inside space-y-1 my-2">{children}</ul>
                    ),
                  },
                  ol: {
                    component: ({ children, ...props }) => (
                      <ol {...props} className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                    ),
                  },
                  blockquote: {
                    component: ({ children, ...props }) => (
                      <blockquote {...props} className="border-l-4 border-blue-500 pl-4 py-2 my-2 italic text-gray-300">{children}</blockquote>
                    ),
                  },
                },
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}
