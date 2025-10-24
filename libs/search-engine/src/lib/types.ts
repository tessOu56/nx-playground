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

