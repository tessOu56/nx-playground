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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-32'>
      <div className='container mx-auto px-4 py-12'>
        {/* Page Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            AI-Powered Search
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Ask me anything about my projects, tech stack, or experience. I'm
            here to help you explore!
          </p>
        </div>

        {/* Chat Container */}
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-h-[70vh]'>
            {/* Info Banner inside chat */}
            <div className='border-b border-gray-200 dark:border-gray-700 p-4'>
              <InfoBanner />
            </div>

            {/* Messages Area - Scrollable */}
            <div className='p-6'>
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
      </div>

      {/* Input Area - Fixed at bottom of viewport */}
      <div className='fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg z-40'>
        <div className='container mx-auto max-w-4xl'>
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
