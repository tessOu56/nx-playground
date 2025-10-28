#!/usr/bin/env node

/**
 * Add Front Matter to existing documentation files
 *
 * Usage: node scripts/add-frontmatter-to-docs.js
 */

const fs = require('fs');
const path = require('path');

const docsRoot = path.join(__dirname, '..', 'docs');

/**
 * Add front matter to a file
 */
function addFrontMatter(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has front matter
  if (content.startsWith('---')) {
    console.log(`⏭️  ${path.basename(filePath)} already has front matter`);
    return;
  }

  // Extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  // Extract slug from filename
  const filename = path.basename(filePath, '.md');
  const slug = filename.toLowerCase().replace(/_/g, '-');

  // Extract excerpt from content
  const excerptMatch = content.match(/^>\s+(.+)$/m);
  const excerpt = excerptMatch ? excerptMatch[1] : '';

  // Determine language from path
  const lang = filePath.includes('/zh-TW/') ? 'zh-TW' : 'en';

  // Generate front matter
  const frontMatter = `---
title: '${title}'
slug: '${slug}'
category: '${category}'
tags: []
date: '${new Date().toISOString().split('T')[0]}'
excerpt: '${excerpt}'
author: 'NX Playground'
lang: '${lang}'
published: true
---

`;

  // Write back to file
  fs.writeFileSync(filePath, frontMatter + content);
  console.log(`✅ Added front matter to ${filename}.md`);
}

/**
 * Process a directory
 */
function processDirectory(dir, category) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (file.endsWith('.md') && file !== 'README.md') {
      addFrontMatter(path.join(dir, file), category);
    }
  });
}

/**
 * Main function
 */
function main() {
  console.log('📝 Adding Front Matter to documentation files...\n');

  try {
    // Process apps - zh-TW
    console.log('Processing apps/zh-TW...');
    const appsZhTWDir = path.join(docsRoot, 'apps', 'zh-TW');
    processDirectory(appsZhTWDir, 'apps');
    console.log('');

    // Process apps - en
    console.log('Processing apps/en...');
    const appsEnDir = path.join(docsRoot, 'apps', 'en');
    processDirectory(appsEnDir, 'apps');
    console.log('');

    // Process libs - zh-TW
    console.log('Processing libs/zh-TW...');
    const libsZhTWDir = path.join(docsRoot, 'libs', 'zh-TW');
    processDirectory(libsZhTWDir, 'libs');
    console.log('');

    // Process libs - en
    console.log('Processing libs/en...');
    const libsEnDir = path.join(docsRoot, 'libs', 'en');
    processDirectory(libsEnDir, 'libs');
    console.log('');

    console.log('✅ Front Matter addition complete!\n');
    console.log('📝 Next steps:');
    console.log('1. Review the added front matter in each file');
    console.log('2. Update tags for each document (currently empty)');
    console.log('3. Test the blog by running: pnpm dev:profile');
    console.log('4. Navigate to /zh-TW/blog to see all posts\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run
main();


