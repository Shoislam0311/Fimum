'use client';

import React from 'react';
import Markdown from 'markdown-to-jsx';
import { Message } from '@/types/chat';
import { User, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
      )}
      
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3
          ${isUser
            ? 'bg-blue-600 text-white'
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
                      <pre {...props} className="bg-gray-900 p-3 rounded-lg overflow-x-auto">
                        {children}
                      </pre>
                    ),
                  },
                  code: {
                    component: ({ children, ...props }) => (
                      <code {...props} className="bg-gray-900 px-1 py-0.5 rounded text-blue-400">
                        {children}
                      </code>
                    ),
                  },
                  a: {
                    component: ({ children, ...props }) => (
                      <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
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
