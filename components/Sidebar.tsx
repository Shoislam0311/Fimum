'use client';

import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Menu, X } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';
import { MODEL_CONFIGS } from '@/lib/models';

export default function Sidebar() {
  const {
    conversations,
    currentConversation,
    createNewConversation,
    loadConversation,
    deleteConversation,
  } = useChatContext();
  
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteConversation(id);
    }
  };

  const groupedConversations = conversations.reduce((acc, conv) => {
    const date = formatDate(conv.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(conv);
    return acc;
  }, {} as Record<string, typeof conversations>);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-gray-800/90 backdrop-blur-sm text-white hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-blue-500 shadow-lg hover:shadow-blue-500/30 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-gray-900 border-r border-gray-800 text-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => {
              createNewConversation();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 transform"
          >
            <Plus size={20} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.keys(groupedConversations).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                  {date}
                </h3>
                <div className="space-y-1">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        loadConversation(conv.id);
                        setIsOpen(false);
                      }}
                      className={`
                        group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                        transition-all duration-200
                        ${currentConversation?.id === conv.id
                          ? 'bg-gray-800 text-white shadow-md border-l-2 border-blue-500'
                          : 'hover:bg-gray-800/50 text-gray-300 hover:translate-x-1'
                        }
                      `}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        {MODEL_CONFIGS[conv.mode]?.icon || '💬'}
                      </span>
                      <span className="flex-1 truncate text-sm">
                        {conv.title}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="text-center">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fimum
            </h2>
            <p className="text-xs text-gray-500 mt-1">AI Assistant</p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
