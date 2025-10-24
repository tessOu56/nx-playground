import type { SearchableItem, SearchIndex } from './types';

/**
 * Build search index from raw data
 */
export function buildSearchIndex(data: {
  projects?: any[];
  blogs?: any[];
  techStack?: any[];
}): SearchIndex {
  const index: SearchIndex = {
    projects: [],
    blogs: [],
    tech: [],
  };

  // Index projects
  if (data.projects) {
    index.projects = data.projects.map(project => ({
      type: 'project' as const,
      id: project.id,
      name: project.name || project.id,
      description: project.description || project.shortDesc || '',
      keywords: [
        project.name?.toLowerCase(),
        project.id.toLowerCase(),
        ...(project.techStack?.map((t: string) => t.toLowerCase()) || []),
        ...(project.features?.map((f: string) => f.toLowerCase()) || []),
        ...(project.highlights?.map((h: string) => h.toLowerCase()) || []),
        project.category?.toLowerCase(),
      ].filter(Boolean),
      content: [
        project.description,
        project.shortDesc,
        project.purpose,
        ...(project.features || []),
        ...(project.highlights || []),
      ]
        .filter(Boolean)
        .join(' '),
      metadata: {
        techStack: project.techStack,
        category: project.category,
        url: `/projects/${project.id}`,
      },
    }));
  }

  // Index blogs
  if (data.blogs) {
    index.blogs = data.blogs.map(blog => ({
      type: 'blog' as const,
      id: blog.id || blog.slug,
      name: blog.title,
      description: blog.excerpt || '',
      keywords: [
        blog.title.toLowerCase(),
        blog.slug?.toLowerCase(),
        ...(blog.techStack?.map((t: string) => t.toLowerCase()) || []),
        ...(blog.tags?.map((t: string) => t.toLowerCase()) || []),
        blog.year?.toString(),
      ].filter(Boolean),
      content: [blog.title, blog.excerpt, ...(blog.tags || [])].join(' '),
      metadata: {
        year: blog.year,
        techStack: blog.techStack,
        url: `/blogs/${blog.slug || blog.id}`,
      },
    }));
  }

  // Index tech stack
  if (data.techStack) {
    index.tech = data.techStack.map(tech => ({
      type: 'tech' as const,
      id: tech.name.toLowerCase().replace(/\s+/g, '-'),
      name: tech.name,
      description: `Technology: ${tech.name}`,
      keywords: [
        tech.name.toLowerCase(),
        tech.category?.toLowerCase(),
        ...(tech.tags?.map((t: string) => t.toLowerCase()) || []),
      ].filter(Boolean),
      content: `${tech.name} ${tech.category || ''}`,
      metadata: {
        category: tech.category,
      },
    }));
  }

  return index;
}

