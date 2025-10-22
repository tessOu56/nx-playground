import type { FC } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const initialQuery = searchParams.get('q') || '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

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

  // Handle initial query
  useState(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  });

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Info Banner */}
        <InfoBanner />

        {/* Messages Area */}
        <div
          className='bg-white dark:bg-gray-800 rounded-lg shadow-lg min-h-[60vh] max-h-[70vh] overflow-y-auto mb-4 p-6'
          role='log'
          aria-live='polite'
          aria-label='Conversation'
        >
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

        {/* Input Area */}
        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};
