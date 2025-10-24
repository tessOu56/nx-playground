import type { SearchResult } from './types';

/**
 * Generate response based on search results and query intent
 */
export function generateResponse(
  query: string,
  results: SearchResult[],
  intent: { type: string; keywords: string[] }
): string {
  if (results.length === 0) {
    return noResultsResponse(query, intent);
  }

  switch (intent.type) {
    case 'project':
      return projectResponse(results, query);
    case 'blog':
      return blogResponse(results, query);
    case 'tech':
      return techResponse(results, query);
    case 'experience':
      return experienceResponse(results, query);
    default:
      return generalResponse(results, query);
  }
}

function noResultsResponse(query: string, intent: { type: string }): string {
  const suggestions = [
    "Try asking about specific projects (e.g., 'What projects use React?')",
    "Ask about my tech stack (e.g., 'What technologies do you use?')",
    "Explore my blog posts (e.g., 'Show me your latest blog posts')",
    "Learn about my experience (e.g., 'What experience do you have with Nx?')",
  ];

  return `I couldn't find anything specifically matching "${query}". 

Here are some suggestions:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Feel free to ask me anything about my work!`;
}

function projectResponse(results: SearchResult[], query: string): string {
  const topResults = results.slice(0, 5);
  
  let response = `I found ${results.length} project${results.length > 1 ? 's' : ''} related to your query:\n\n`;

  topResults.forEach((result, index) => {
    const { item } = result;
    const techStack = item.metadata?.techStack?.slice(0, 3).join(', ') || 'N/A';
    
    response += `**${index + 1}. ${item.name}**\n`;
    response += `${item.description}\n`;
    response += `Tech Stack: ${techStack}${item.metadata?.techStack && item.metadata.techStack.length > 3 ? ', ...' : ''}\n\n`;
  });

  if (results.length > 5) {
    response += `...and ${results.length - 5} more projects. You can view all projects in the Projects page!`;
  }

  return response;
}

function blogResponse(results: SearchResult[], query: string): string {
  const topResults = results.slice(0, 5);
  
  let response = `I found ${results.length} blog post${results.length > 1 ? 's' : ''} that might interest you:\n\n`;

  topResults.forEach((result, index) => {
    const { item } = result;
    const year = item.metadata?.year || 'Unknown';
    
    response += `**${index + 1}. ${item.name}** (${year})\n`;
    response += `${item.description}\n\n`;
  });

  if (results.length > 5) {
    response += `...and ${results.length - 5} more blog posts. Check out the Blogs page to read them all!`;
  }

  return response;
}

function techResponse(results: SearchResult[], query: string): string {
  const uniqueTechs = new Set<string>();
  const projectsPerTech = new Map<string, string[]>();

  results.forEach(result => {
    const techStack = result.item.metadata?.techStack || [];
    techStack.forEach(tech => {
      uniqueTechs.add(tech);
      if (!projectsPerTech.has(tech)) {
        projectsPerTech.set(tech, []);
      }
      projectsPerTech.get(tech)?.push(result.item.name);
    });
  });

  let response = `Here are the technologies I use:\n\n`;

  Array.from(uniqueTechs).slice(0, 10).forEach(tech => {
    const projects = projectsPerTech.get(tech) || [];
    response += `**${tech}**\n`;
    response += `Used in: ${projects.slice(0, 3).join(', ')}`;
    if (projects.length > 3) {
      response += ` (+${projects.length - 3} more)`;
    }
    response += `\n\n`;
  });

  if (uniqueTechs.size > 10) {
    response += `...and ${uniqueTechs.size - 10} more technologies!`;
  }

  return response;
}

function experienceResponse(results: SearchResult[], query: string): string {
  const projects = results.filter(r => r.item.type === 'project').slice(0, 3);
  const blogs = results.filter(r => r.item.type === 'blog').slice(0, 2);

  let response = `Based on my portfolio:\n\n`;

  if (projects.length > 0) {
    response += `**Relevant Projects:**\n`;
    projects.forEach(r => {
      response += `• ${r.item.name}: ${r.item.description.slice(0, 100)}...\n`;
    });
    response += `\n`;
  }

  if (blogs.length > 0) {
    response += `**Related Blog Posts:**\n`;
    blogs.forEach(r => {
      response += `• ${r.item.name} (${r.item.metadata?.year || ''})\n`;
    });
    response += `\n`;
  }

  response += `Feel free to ask me more specific questions about any of these!`;

  return response;
}

function generalResponse(results: SearchResult[], query: string): string {
  const topResults = results.slice(0, 5);
  
  let response = `Here's what I found:\n\n`;

  const grouped = topResults.reduce((acc, result) => {
    const type = result.item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  Object.entries(grouped).forEach(([type, items]) => {
    response += `**${type.charAt(0).toUpperCase() + type.slice(1)}s:**\n`;
    items.forEach(r => {
      response += `• ${r.item.name}\n`;
    });
    response += `\n`;
  });

  return response;
}

