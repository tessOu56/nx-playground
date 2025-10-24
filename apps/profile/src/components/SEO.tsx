import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  tags?: string[];
}

export function SEO({
  title = 'Tess - Full-Stack Developer Portfolio',
  description = 'Explore my projects, tech stack, and development journey. Specialized in React, TypeScript, Nx Monorepo, and modern web technologies.',
  image = 'https://picsum.photos/1200/630?random=og',
  url,
  type = 'website',
  author = 'Tess',
  publishedTime,
  tags = [],
}: SEOProps) {
  const siteUrl = 'https://tess-profile.pages.dev';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = title.includes('Tess') ? title : `${title} | Tess`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='author' content={author} />
      {tags.length > 0 && <meta name='keywords' content={tags.join(', ')} />}

      {/* Open Graph */}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:url' content={fullUrl} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content='Tess Portfolio' />
      {publishedTime && <meta property='article:published_time' content={publishedTime} />}
      {tags.length > 0 && tags.map(tag => (
        <meta key={tag} property='article:tag' content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Canonical URL */}
      <link rel='canonical' href={fullUrl} />
    </Helmet>
  );
}

