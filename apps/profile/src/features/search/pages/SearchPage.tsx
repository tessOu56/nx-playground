import {
  buildSearchIndex,
  detectIntent,
  generateResponse,
  searchItems,
  type SearchIndex,
} from '@nx-playground/search-engine';
import { techStack } from '@nx-playground/tech-stack-data';
import { type FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SEO } from '../../../components/SEO';
import { loadAllBlogMetadata } from '../../../lib/blogLoader';
import { loadAllApps, loadAllLibs } from '../../../lib/projectLoader';
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
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);

  // Build search index on mount
  useEffect(() => {
    const buildIndex = async () => {
      try {
        const [projects, blogs] = await Promise.all([
          Promise.all([loadAllApps('en'), loadAllLibs('en')]).then(([apps, libs]) => [...apps, ...libs]),
          loadAllBlogMetadata('en'),
        ]);

        const index = buildSearchIndex({
          projects,
          blogs,
          techStack,
        });

        setSearchIndex(index);
      } catch (error) {
        console.error('Failed to build search index:', error);
      }
    };

    buildIndex();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !searchIndex) return;

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

    // Search and generate AI response
    setIsLoading(true);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      try {
        // Detect query intent
        const intent = detectIntent(content);

        // Search across all items
        const allItems = [
          ...searchIndex.projects,
          ...searchIndex.blogs,
          ...searchIndex.tech,
        ];
        const results = searchItems(content, allItems, 10);

        // Generate response
        const responseContent = generateResponse(content, results, intent);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Search error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I encountered an error while searching. Please try again!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Handle initial query - use useEffect instead of useState
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return (
    <>
      <SEO
        title='AI Search'
        description='Ask me anything about my projects, tech stack, or experience. AI-powered knowledge assistant to help you explore my work.'
        url='/search'
        tags={['AI Search', 'Assistant', 'Projects', 'Tech Stack']}
      />
      
      {/* Full page with dark gradient background */}
      <section
        className='relative pb-32'
        data-header-dark='true'
        style={{ minHeight: 'calc(100vh + 10rem)' }}
      >
        {/* Background covering full section including header */}
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' />

        <div
          className='relative container mx-auto px-4 pt-24 flex-1'
          style={{ zIndex: 1 }}
        >
          {/* Page Header */}
          <div className='text-center max-w-3xl mx-auto mb-12'>
            <h1 className='text-5xl font-bold text-white mb-6'>
              AI-Powered Search
            </h1>
            <p className='text-xl text-gray-200 mb-4 leading-relaxed'>
              Ask me anything about my projects, tech stack, or experience. I'm
              here to help you explore!
            </p>
            <p className='text-sm text-gray-400'>
              AI assistant powered by knowledge of all projects, blogs, and tech
              stack
            </p>
          </div>

          {/* Chat Container */}
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
      </section>

      {/* Input Area - Fixed at bottom of viewport */}
      <div className='fixed bottom-0 left-0 right-0 backdrop-blur-lg p-4 z-40'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <MessageInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
};
