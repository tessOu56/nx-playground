export interface SearchableItem {
  type: 'project' | 'blog' | 'tech';
  id: string;
  name: string;
  description: string;
  keywords: string[];
  content: string;
  metadata?: {
    year?: number;
    techStack?: string[];
    category?: string;
    url?: string;
  };
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  matchedKeywords: string[];
}

export interface SearchIndex {
  projects: SearchableItem[];
  blogs: SearchableItem[];
  tech: SearchableItem[];
}

export type IntentType = 'project_search' | 'tech_stack' | 'blog_search' | 'general';

export interface Intent {
  type: 'project' | 'blog' | 'tech' | 'experience' | 'general';
  keywords: string[];
}

