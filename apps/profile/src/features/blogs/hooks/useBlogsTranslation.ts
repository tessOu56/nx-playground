/**
 * Blogs feature translation hook
 */

import { createFeatureTranslation } from '@nx-playground/i18n';

export const useBlogsTranslation = createFeatureTranslation('blogs', [
  'title',
  'subtitle',
  'searchPlaceholder',
  'noResults',
  'readMore',
  'readingTime',
  'publishedOn',
  'updatedOn',
  'allTags',
  'filterByTag',
  'filterByCategory',
  'categories.apps',
  'categories.libs',
  'categories.all',
  'tags.all',
  'share.title',
  'share.copyLink',
  'share.linkCopied',
  'toc.title',
  'language.switchTo',
  'language.zh-TW',
  'language.en',
  'fallbackNotice',
  'nav.title',
]);

// Backward compatibility
export const useBlogTranslation = useBlogsTranslation;

