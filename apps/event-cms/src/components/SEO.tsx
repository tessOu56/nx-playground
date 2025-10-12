import { type FC } from 'react';
import { Helmet } from 'react-helmet-async';

import { type MetaDataConfig } from '../lib';

interface SEOProps {
  config: MetaDataConfig;
}

export const SEO: FC<SEOProps> = ({ config }) => {
  const {
    title,
    description,
    keywords,
    author,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterSite,
    canonical,
  } = config;

  return (
    <Helmet>
      {/* 基本 meta 標籤 */}
      {title && <title>{title}</title>}
      {description && <meta name='description' content={description} />}
      {keywords && (
        <meta
          name='keywords'
          content={Array.isArray(keywords) ? keywords.join(', ') : keywords}
        />
      )}
      {author && <meta name='author' content={author} />}
      {canonical && <link rel='canonical' href={canonical} />}

      {/* Open Graph */}
      {ogTitle && <meta property='og:title' content={ogTitle} />}
      {ogDescription && (
        <meta property='og:description' content={ogDescription} />
      )}
      {ogImage && <meta property='og:image' content={ogImage} />}
      {ogUrl && <meta property='og:url' content={ogUrl} />}
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='NX Playground Console' />

      {/* Twitter Cards */}
      <meta
        name='twitter:card'
        content={twitterCard ?? 'summary_large_image'}
      />
      {twitterSite && <meta name='twitter:site' content={twitterSite} />}
      {ogTitle && <meta name='twitter:title' content={ogTitle} />}
      {ogDescription && (
        <meta name='twitter:description' content={ogDescription} />
      )}
      {ogImage && <meta name='twitter:image' content={ogImage} />}

      {/* 其他重要 meta 標籤 */}
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#3b82f6' />
    </Helmet>
  );
};
