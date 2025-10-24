import { type FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSearchStore } from '../../../stores/searchStore';
import { ChatMessage } from '../components/ChatMessage';
import { ExampleQueries } from '../components/ExampleQueries';
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
    <div className='min-h-screen pb-32'>
      {/* Top section with light background - header stays light mode */}
      <div className='bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center max-w-3xl mx-auto'>
            <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-6'>
              AI-Powered Search
            </h1>
            <p className='text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed'>
              Ask me anything about my projects, tech stack, or experience. I'm
              here to help you explore!
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              AI assistant powered by knowledge of all projects, blogs, and tech
              stack
            </p>
          </div>
        </div>
      </div>

      {/* Gradient section with dark background - header switches to dark mode when entered */}
      <div
        className='bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 py-8'
        data-header-dark='true'
      >
        {/* Chat Container - Invisible border, natural flow */}
        <div className='container mx-auto'>
          <div className='max-w-4xl mx-auto'>
            {/* Messages Area */}
            <div className='min-h-[70vh]'>
              {messages.length === 0 ? (
                <ExampleQueries onQueryClick={handleSendMessage} />
              ) : (
                <div className='space-y-4'>
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className='flex items-center gap-2 text-gray-300'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400' />
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
      <div className='fixed bottom-0 left-0 right-0 backdrop-blur-lg p-4 z-40'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <MessageInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};
