/**
 * Blog mock data generators
 */

export interface MockBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  tags: string[];
  techStack: string[];
}

export function createMockBlog(overrides: Partial<MockBlog> = {}): MockBlog {
  return {
    id: 'blog-1',
    slug: '2024-12',
    title: 'Test Blog Post',
    excerpt: 'This is a test blog excerpt',
    content: '# Test Blog\n\nThis is test content.',
    publishDate: '2024-12-01',
    tags: ['test', 'mock'],
    techStack: ['React', 'TypeScript'],
    ...overrides,
  };
}

export function createMockBlogs(count: number): MockBlog[] {
  return Array.from({ length: count }, (_, i) =>
    createMockBlog({
      id: `blog-${i + 1}`,
      slug: `2024-${String(i + 1).padStart(2, '0')}`,
      title: `Blog Post ${i + 1}`,
    })
  );
}

