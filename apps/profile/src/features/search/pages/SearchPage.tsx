import {
  buildSearchIndex,
  detectIntent,
  generateResponse,
  generateSuggestedQuestions,
  searchItems,
  type SearchIndex,
} from '@nx-playground/search-engine';
import { track } from '@nx-playground/analytics';
import { logger } from '@nx-playground/logger';
import { techStack } from '@nx-playground/tech-stack-data';
import { type FC, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';

import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { SEO } from '../../../components/SEO';
import { Footer } from '../../../components/layout/Footer';
import { loadAllBlogMetadata } from '../../../lib/blogLoader';
import { loadAllApps, loadAllLibs } from '../../../lib/projectLoader';
import { useSearchStore, type Message } from '../../../stores/searchStore';
import { ChatMessage } from '../components/ChatMessage';
import { ExampleQueries } from '../components/ExampleQueries';
import { MessageInput } from '../components/MessageInput';
import { SuggestedQuestions } from '../components/SuggestedQuestions';

export const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const {
    addMessage,
    createNewSession,
    getCurrentSession,
    clearCurrentSession,
  } = useSearchStore();

  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestUserMessageRef = useRef<HTMLDivElement>(null);

  // Get current session messages
  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  // Build search index on mount
  useEffect(() => {
    const buildIndex = async () => {
      try {
        logger.debug('Building search index');
        
        const indexData = await logger.time('build-search-index', async () => {
          const [projects, blogs] = await Promise.all([
            Promise.all([loadAllApps('en'), loadAllLibs('en')]).then(([apps, libs]) => [...apps, ...libs]),
            loadAllBlogMetadata('en'),
          ]);

          return buildSearchIndex({
            projects,
            blogs,
            techStack,
          });
        });

        setSearchIndex(indexData);
        logger.info('Search index built', {
          projectsCount: indexData.projects.length,
          blogsCount: indexData.blogs.length,
          techStackCount: indexData.techStack.length,
        });
      } catch (error) {
        logger.error('Failed to build search index', error);
      }
    };

    buildIndex();
  }, []);

  // Auto-scroll when new user message is added
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      // Wait for DOM to render
      setTimeout(() => {
        latestUserMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 150);
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !searchIndex) return;

    logger.info('User search query', { query: content, sessionId: currentSession?.id });

    // Track AI search query
    track('ai_search_query', {
      query: content.substring(0, 100), // Limit length for privacy
      sessionId: currentSession?.id || 'new',
      messageCount: messages.length + 1,
    });

    // Mark as unsaved changes
    setHasUnsavedChanges(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Search and generate AI response
    setIsLoading(true);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      try {
        // Detect query intent
        const intent = detectIntent(content);
        logger.debug('Intent detected', { intent, query: content });

        // Search across all items
        const allItems = [
          ...searchIndex.projects,
          ...searchIndex.blogs,
          ...searchIndex.tech,
        ];
        const results = searchItems(content, allItems, 10);
        logger.debug('Search results', { 
          query: content, 
          resultCount: results.length,
          topResult: results[0]?.title,
        });

        // Generate response
        const responseContent = generateResponse(content, results, intent);

        // Generate suggested questions based on conversation
        const conversationHistory = [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content },
          { role: 'assistant' as const, content: responseContent },
        ];
        const suggestions = generateSuggestedQuestions(conversationHistory, intent);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
          suggestedQuestions: suggestions,
        };
        addMessage(aiMessage);
        
              logger.info('Search completed', {
                query: content,
                resultsCount: results.length,
                suggestionsCount: suggestions.length,
              });

              // Track search results
              track('ai_search_completed', {
                query: content.substring(0, 100),
                resultCount: results.length,
                intent,
                suggestionsCount: suggestions.length,
              });

              // Mark as saved
              setHasUnsavedChanges(false);
      } catch (error) {
        logger.error('Search query failed', error, { query: content });
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I encountered an error while searching. Please try again!",
          timestamp: new Date(),
        };
        addMessage(errorMessage);
        setHasUnsavedChanges(false);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Handle new conversation
  const handleNewConversation = () => {
    const userConfirmed = window.confirm(
      messages.length > 0 
        ? '確定要開始新的對話嗎？當前對話已儲存。'
        : '確定要開始新的對話嗎？'
    );
    if (!userConfirmed) return;

      logger.info('Starting new conversation', {
        previousSessionId: currentSession?.id,
        previousMessageCount: messages.length,
      });

      // Track new conversation
      track('ai_search_new_conversation', {
        previousMessageCount: messages.length,
        previousSessionId: currentSession?.id || 'none',
      });

      createNewSession();
      setHasUnsavedChanges(false);
  };

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '您有未儲存的對話內容，確定要離開嗎？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
        className='relative pb-48'
        data-header-dark='true'
        style={{ minHeight: 'calc(100vh + 12rem)' }}
      >
        {/* Background covering full section including header */}
        <div className='absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' />

        <div
          className='relative container mx-auto px-4 pt-24 flex-1'
          style={{ zIndex: 1 }}
        >
          {/* Page Header with New Conversation Button */}
          <div className='text-center max-w-3xl mx-auto mb-12'>
            <div className='flex items-center justify-center gap-4 mb-6'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white'>
                AI-Powered Search
              </h1>
              {messages.length > 0 && (
                <button
                  onClick={handleNewConversation}
                  className='flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all backdrop-blur-sm border border-white/20'
                  aria-label='Start new conversation'
                >
                  <RotateCcw className='w-4 h-4' />
                  <span className='hidden sm:inline'>重新開始</span>
                </button>
              )}
            </div>
            <p className='text-base sm:text-lg md:text-xl text-gray-200 mb-4 leading-relaxed px-4'>
              Ask me anything about my projects, tech stack, or experience. I'm
              here to help you explore!
            </p>
            <p className='text-xs sm:text-sm text-gray-400'>
              AI assistant powered by knowledge of all projects, blogs, and tech
              stack
            </p>
          </div>

          {/* Chat Container */}
          <div className='max-w-4xl mx-auto'>
            {!searchIndex ? (
              <div className='min-h-[70vh] flex items-center justify-center'>
                <LoadingSpinner size='lg' color='white' text='Loading knowledge base...' />
              </div>
            ) : (
              <>
                {/* Example Queries - Always at top, can scroll up to access */}
                <div className='mb-8'>
                  <ExampleQueries onQueryClick={handleSendMessage} />
                </div>

                {/* Messages Area */}
                {messages.length > 0 && (
                  <div className='space-y-4 mb-8'>
                    {messages.map((message, index) => {
                      const isLatestUser =
                        message.role === 'user' &&
                        index === messages.length - (isLoading ? 1 : 2);
                      
                      return (
                        <div
                          key={message.id}
                          ref={isLatestUser ? latestUserMessageRef : null}
                        >
                          <ChatMessage message={message} />
                          {/* Show suggested questions after AI messages */}
                          {message.role === 'assistant' &&
                            message.suggestedQuestions &&
                            message.suggestedQuestions.length > 0 && (
                              <SuggestedQuestions
                                questions={message.suggestedQuestions}
                                onQuestionClick={handleSendMessage}
                              />
                            )}
                        </div>
                      );
                    })}
                    {isLoading && (
                      <LoadingSpinner size='sm' color='white' text='Thinking...' />
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Input Area - Fixed at bottom of viewport */}
      <div className='fixed bottom-0 left-0 right-0 backdrop-blur-lg z-40'>
        <div className='container mx-auto px-4 py-4'>
          <div className='max-w-4xl mx-auto'>
            <MessageInput onSend={handleSendMessage} disabled={isLoading} />
            {/* Footer integrated below input */}
            <div className='mt-3'>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
