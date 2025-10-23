import { type FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchStore } from '../../../stores/searchStore';
import { ChatMessage } from '../components/ChatMessage';
import { ExampleQueries } from '../components/ExampleQueries';
import { InfoBanner } from '../components/InfoBanner';
import { MessageInput } from '../components/MessageInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const { setHasSearchHistory } = useSearchStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Mark that user has search history using store
    setHasSearchHistory(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response (placeholder)
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm currently being set up! Soon I'll be able to answer questions about projects, tech stack, and experience. Stay tuned! 🤖",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Handle initial query - use useEffect instead of useState
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className='h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
      {/* 1. Info Banner - Fixed at top */}
      <div className='flex-shrink-0 px-4 pt-8'>
        <div className='max-w-4xl mx-auto'>
          <InfoBanner />
        </div>
      </div>

      {/* 2. Messages Area - Scrollable middle section */}
      <div className='flex-1 overflow-y-auto px-4 py-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-full'>
            {messages.length === 0 ? (
              <ExampleQueries onQueryClick={handleSendMessage} />
            ) : (
              <div className='space-y-4'>
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Input Area - Fixed at bottom */}
      <div className='flex-shrink-0 border-t bg-white dark:bg-gray-800 p-4'>
        <div className='max-w-4xl mx-auto'>
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
