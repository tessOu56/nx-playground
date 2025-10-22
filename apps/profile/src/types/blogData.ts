export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  publishDate: string; // ISO date string
  year?: number; // For timeline association
  techStack?: string[]; // Tech used in that year
  tags: string[];
  coverImage?: string;
  author?: string;
  readingTime?: number; // Estimated reading time in minutes
}

export interface BlogMetadata {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string;
  year?: number;
  techStack?: string[];
  tags: string[];
  coverImage?: string;
  readingTime?: number;
}

