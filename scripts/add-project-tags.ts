#!/usr/bin/env tsx
/**
 * Add Project Tags Script
 * 為所有 Nx 專案加入 tags，用於 dependency constraints 和 CI/CD 過濾
 * 
 * Usage:
 *   tsx scripts/add-project-tags.ts [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const isDryRun = process.argv.includes('--dry-run');

interface ProjectConfig {
  name: string;
  tags?: string[];
  [key: string]: unknown;
}

interface ProjectTags {
  path: string;
  tags: string[];
}

// 專案 Tags 定義
const PROJECT_TAGS: Record<string, ProjectTags> = {
  // Apps
  'profile': {
    path: 'apps/profile/project.json',
    tags: ['type:app', 'stack:react', 'scope:primary', 'status:production'],
  },
  'event-cms': {
    path: 'apps/event-cms/project.json',
    tags: ['type:app', 'stack:react', 'scope:primary', 'status:development'],
  },
  'auth': {
    path: 'apps/auth/project.json',
    tags: ['type:app', 'stack:react', 'scope:primary', 'status:development'],
  },
  'event-portal': {
    path: 'apps/event-portal/project.json',
    tags: ['type:app', 'stack:nextjs', 'scope:hybrid', 'status:development'],
  },
  'vue-motion': {
    path: 'apps/vue-motion/project.json',
    tags: ['type:app', 'stack:vue', 'scope:secondary', 'status:demo'],
  },
  'enterprise-admin': {
    path: 'apps/enterprise-admin/project.json',
    tags: ['type:app', 'stack:angular', 'scope:secondary', 'status:experimental'],
  },
  'api-server': {
    path: 'apps/api-server/project.json',
    tags: ['type:app', 'stack:nestjs', 'scope:backend', 'status:functional'],
  },

  // Libraries
  'ui-components': {
    path: 'libs/ui-components/project.json',
    tags: ['type:lib', 'stack:react', 'scope:primary', 'category:ui'],
  },
  'design-system': {
    path: 'libs/design-system/project.json',
    tags: ['type:lib', 'stack:agnostic', 'scope:shared', 'category:ui'],
  },
  'i18n': {
    path: 'libs/i18n/project.json',
    tags: ['type:lib', 'stack:agnostic', 'scope:shared', 'category:utils'],
  },
  'search-engine': {
    path: 'libs/search-engine/project.json',
    tags: ['type:lib', 'stack:agnostic', 'scope:shared', 'category:utils'],
  },
  'supabase-client': {
    path: 'libs/supabase-client/project.json',
    tags: ['type:lib', 'stack:agnostic', 'scope:shared', 'category:data'],
  },
  'api-client': {
    path: 'libs/api-client/project.json',
    tags: ['type:lib', 'stack:agnostic', 'scope:shared', 'category:data'],
  },
  'charts': {
    path: 'libs/charts/project.json',
    tags: ['type:lib', 'stack:react', 'scope:primary', 'category:ui'],
  },
  'hooks': {
    path: 'libs/hooks/project.json',
    tags: ['type:lib', 'stack:react', 'scope:primary', 'category:utils'],
  },
  'tech-stack-data': {
    path: 'libs/tech-stack-data/project.json',
    tags: ['type:lib', 'stack:agnostic', 'scope:shared', 'category:data'],
  },
  'auth-client': {
    path: 'libs/auth-client/project.json',
    tags: ['type:lib', 'stack:react', 'scope:primary', 'category:utils'],
  },
  'animation-data': {
    path: 'libs/animation-data/project.json',
    tags: ['type:lib', 'stack:vue', 'scope:secondary', 'category:data'],
  },
  'enterprise-data': {
    path: 'libs/enterprise-data/project.json',
    tags: ['type:lib', 'stack:angular', 'scope:secondary', 'category:data'],
  },
};

function addTagsToProject(projectName: string, config: ProjectTags): boolean {
  const fullPath = join(process.cwd(), config.path);

  if (!existsSync(fullPath)) {
    console.warn(`⚠️  Project file not found: ${config.path}`);
    return false;
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    const projectConfig: ProjectConfig = JSON.parse(content);

    // 檢查是否已有 tags
    const existingTags = projectConfig.tags || [];
    const newTags = config.tags;

    // Merge and deduplicate
    const mergedTags = Array.from(new Set([...existingTags, ...newTags]));

    if (JSON.stringify(existingTags.sort()) === JSON.stringify(mergedTags.sort())) {
      console.log(`✓ ${projectName}: Tags already up to date`);
      return true;
    }

    // Update tags
    projectConfig.tags = mergedTags.sort();

    if (isDryRun) {
      console.log(`[DRY RUN] Would update ${projectName}:`);
      console.log(`  Existing: ${JSON.stringify(existingTags)}`);
      console.log(`  New:      ${JSON.stringify(projectConfig.tags)}`);
    } else {
      // Write back to file
      writeFileSync(fullPath, JSON.stringify(projectConfig, null, 2) + '\n', 'utf-8');
      console.log(`✅ ${projectName}: Tags updated`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error processing ${projectName}:`, error);
    return false;
  }
}

function main() {
  console.log('🏷️  Adding Project Tags to Nx Monorepo\n');

  if (isDryRun) {
    console.log('📋 DRY RUN MODE - No files will be modified\n');
  }

  let successCount = 0;
  let failCount = 0;

  for (const [projectName, config] of Object.entries(PROJECT_TAGS)) {
    const success = addTagsToProject(projectName, config);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);

  if (isDryRun) {
    console.log('\n💡 Run without --dry-run to apply changes');
  } else {
    console.log('\n✨ All done! Project tags have been updated.');
    console.log('\n🔍 Verify with:');
    console.log('  nx show projects --with-target=build --projects="tag:scope:primary"');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

main();

