#!/usr/bin/env node

/**
 * Update tags in documentation Front Matter
 *
 * Usage: node scripts/update-docs-tags.js
 */

const fs = require('fs');
const path = require('path');

const docsRoot = path.join(__dirname, '..', 'docs');

// Define tags for each document
const docsTags = {
  // Apps
  PROFILE: [
    'React 19',
    'Vite',
    'i18n',
    'Cloudflare Pages',
    'Portfolio',
    'React Router',
  ],
  EVENT_CMS: [
    'React 19',
    'Vite',
    'Zustand',
    'React Hook Form',
    'RBAC',
    'CMS',
    'i18n',
  ],
  EVENT_PORTAL: ['Next.js 15', 'SSG', 'LINE LIFF', 'next-intl', 'QR Code'],
  AUTH: ['React 19', 'Vite', 'Ory Kratos', 'Authentication', 'SSO', 'Security'],
  ENTERPRISE_ADMIN: [
    'Angular 20',
    'Signal Store',
    'RBAC',
    'Dual-control',
    'SSE',
  ],
  VUE_MOTION: ['Vue 3', 'GSAP', 'Three.js', 'Lottie', 'Animation', 'Sandbox'],
  API_SERVER: ['NestJS', 'Prisma', 'OpenAPI', 'REST API', 'TypeScript'],

  // Libs
  ENTERPRISE_DATA: ['Angular', 'Data Layer', 'Architecture', 'TypeScript'],
  ANIMATION_DATA: ['Vue', 'Animation', 'Data Layer', 'CSS', 'TypeScript'],
};

/**
 * Update tags in a file's Front Matter
 */
function updateTags(filePath) {
  const filename = path.basename(filePath, '.md');
  const tags = docsTags[filename];

  if (!tags) {
    console.log(`⚠️  No tags defined for ${filename}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if has front matter
  if (!content.startsWith('---')) {
    console.log(`❌ ${filename} does not have front matter`);
    return;
  }

  // Replace tags: [] with actual tags
  const tagsString = `tags: [${tags.map(t => `'${t}'`).join(', ')}]`;
  content = content.replace(/tags:\s*\[\]/, tagsString);

  // Write back
  fs.writeFileSync(filePath, content);
  console.log(`✅ Updated tags for ${filename}.md`);
}

/**
 * Process a directory
 */
function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    if (file.endsWith('.md') && file !== 'README.md') {
      updateTags(path.join(dir, file));
    }
  });
}

/**
 * Main function
 */
function main() {
  console.log('🏷️  Updating documentation tags...\n');

  try {
    // Process apps - zh-TW
    console.log('Processing apps/zh-TW...');
    const appsZhTWDir = path.join(docsRoot, 'apps', 'zh-TW');
    processDirectory(appsZhTWDir);
    console.log('');

    // Process apps - en
    console.log('Processing apps/en...');
    const appsEnDir = path.join(docsRoot, 'apps', 'en');
    processDirectory(appsEnDir);
    console.log('');

    // Process libs - zh-TW
    console.log('Processing libs/zh-TW...');
    const libsZhTWDir = path.join(docsRoot, 'libs', 'zh-TW');
    processDirectory(libsZhTWDir);
    console.log('');

    // Process libs - en
    console.log('Processing libs/en...');
    const libsEnDir = path.join(docsRoot, 'libs', 'en');
    processDirectory(libsEnDir);
    console.log('');

    console.log('✅ Tags update complete!\n');
    console.log('📝 Next step: Test the documentation search');
    console.log('   pnpm dev:profile');
    console.log('   Visit: http://localhost:3003/zh-TW/blog\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run
main();


