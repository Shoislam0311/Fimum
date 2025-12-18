'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Conversation, Message, ModelMode } from '@/types/chat';
import { getConversations, saveConversation, deleteConversation as deleteConversationFromStorage } from '@/lib/storage';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  mode: ModelMode;
  setMode: (mode: ModelMode) => void;
  createNewConversation: (mode?: ModelMode) => void;
  loadConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ModelMode>('normal');

  useEffect(() => {
    const stored = getConversations();
    setConversations(stored);
    if (stored.length > 0) {
      setCurrentConversation(stored[0]);
      setMode(stored[0].mode);
    }
  }, []);

  const createNewConversation = useCallback((newMode?: ModelMode) => {
    const conversation: Conversation = {
      id: nanoid(),
      title: 'New Chat',
      messages: [],
      mode: newMode || mode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setCurrentConversation(conversation);
    setConversations(prev => [conversation, ...prev]);
    if (newMode) setMode(newMode);
  }, [mode]);

  const loadConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      setMode(conversation.mode);
    }
  }, [conversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    let conversation = currentConversation;
    if (!conversation) {
      conversation = {
        id: nanoid(),
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        messages: [],
        mode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCurrentConversation(conversation);
    }

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      timestamp: Date.now(),
      mode,
    };

    const updatedMessages = [...conversation.messages, userMessage];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: conversation.messages.length === 0 
        ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
        : conversation.title,
    };

    setCurrentConversation(updatedConversation);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        mode,
      };

      const messagesWithAssistant = [...updatedMessages, assistantMessage];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  assistantMessage.content += content;
                  
                  const finalConversation = {
                    ...updatedConversation,
                    messages: messagesWithAssistant,
                    updatedAt: Date.now(),
                  };
                  
                  setCurrentConversation(finalConversation);
                }
              } catch (e) {
                console.error('Failed to parse chunk:', e);
              }
            }
          }
        }
      }

      const finalConversation = {
        ...updatedConversation,
        messages: messagesWithAssistant,
        updatedAt: Date.now(),
      };

      setCurrentConversation(finalConversation);
      saveConversation(finalConversation);
      
      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== finalConversation.id);
        return [finalConversation, ...filtered];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        mode,
      };

      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedMessages, errorMessage],
        updatedAt: Date.now(),
      };

      setCurrentConversation(errorConversation);
      saveConversation(errorConversation);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, mode, isLoading]);

  const deleteConversation = useCallback((id: string) => {
    deleteConversationFromStorage(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (currentConversation?.id === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setCurrentConversation(remaining[0] || null);
      if (remaining[0]) setMode(remaining[0].mode);
    }
  }, [conversations, currentConversation]);

  const clearAll = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fimum_conversations');
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        isLoading,
        mode,
        setMode,
        createNewConversation,
        loadConversation,
        sendMessage,
        deleteConversation,
        clearAllConversations: clearAll,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
}
