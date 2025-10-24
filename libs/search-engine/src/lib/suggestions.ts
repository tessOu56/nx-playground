import type { Intent } from './types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate contextual follow-up questions based on conversation history
 */
export function generateSuggestedQuestions(
  messages: Message[],
  lastIntent: Intent
): string[] {
  if (messages.length === 0) return [];

  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .pop()?.content.toLowerCase() || '';

  // Map intent type to suggestion key
  const intentType = lastIntent.type === 'project' ? 'project_search' 
    : lastIntent.type === 'tech' ? 'tech_stack'
    : lastIntent.type === 'blog' ? 'blog_search'
    : 'general';

  // Intent-based suggestions
  const intentSuggestions: Record<string, string[]> = {
    project_search: [
      'What technologies were used in these projects?',
      'Show me more React projects',
      'Tell me about the architecture',
      'What challenges did you face?',
    ],
    tech_stack: [
      'What is your experience level with these?',
      'Show me projects using this tech',
      'What other technologies do you use?',
      'Tell me about your learning journey',
    ],
    blog_search: [
      'Show me more articles on this topic',
      'What did you learn from this?',
      'Any related blog posts?',
      'Tell me more about the implementation',
    ],
    general: [
      'What projects are you most proud of?',
      'Tell me about your tech stack',
      'Show me your latest work',
      'What technologies do you specialize in?',
    ],
  };

  // Keyword-based contextual suggestions
  const contextualSuggestions: string[] = [];

  if (lastUserMessage.includes('react')) {
    contextualSuggestions.push(
      'What React patterns do you use?',
      'Show me your React components library'
    );
  }

  if (lastUserMessage.includes('typescript')) {
    contextualSuggestions.push(
      'How do you structure TypeScript projects?',
      'Show me TypeScript best practices you follow'
    );
  }

  if (lastUserMessage.includes('nx') || lastUserMessage.includes('monorepo')) {
    contextualSuggestions.push(
      'How is your monorepo structured?',
      'What benefits does Nx provide?'
    );
  }

  if (lastUserMessage.includes('architecture')) {
    contextualSuggestions.push(
      'Tell me about your design patterns',
      'How do you handle state management?'
    );
  }

  if (lastUserMessage.includes('blog') || lastUserMessage.includes('article')) {
    contextualSuggestions.push(
      'Show me your latest blog posts',
      'What topics do you write about?'
    );
  }

  // Combine intent-based and contextual suggestions
  const suggestions = [
    ...contextualSuggestions,
    ...(intentSuggestions[intentType] || intentSuggestions.general),
  ];

  // Remove duplicates and limit to 5
  const unique = Array.from(new Set(suggestions));
  
  // Shuffle and take 5
  return unique.sort(() => Math.random() - 0.5).slice(0, 5);
}

