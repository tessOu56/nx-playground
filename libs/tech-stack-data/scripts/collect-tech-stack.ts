#!/usr/bin/env tsx
/**
 * 自動從 nx workspace 和 package.json 收集技術堆疊
 *
 * 功能：
 * 1. 獲取所有 nx 專案
 * 2. 解析每個專案的 package.json
 * 3. 分析技術堆疊和專案相依性
 * 4. 生成 generated-tech-stack.ts
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface TechItem {
  name: string;
  version?: string;
  category: 'frontend' | 'backend' | 'tools' | 'testing' | 'deployment';
  projects: string[];
}

// 技術分類規則（關鍵字匹配）
const categoryRules: Record<
  string,
  'frontend' | 'backend' | 'tools' | 'testing' | 'deployment'
> = {
  // Frontend
  react: 'frontend',
  angular: 'frontend',
  vue: 'frontend',
  next: 'frontend',
  vite: 'frontend',
  tailwindcss: 'frontend',
  'radix-ui': 'frontend',

  // Backend
  nest: 'backend',
  express: 'backend',
  prisma: 'backend',
  postgresql: 'backend',
  mysql: 'backend',

  // Tools
  nx: 'tools',
  eslint: 'tools',
  typescript: 'tools',
  prettier: 'tools',
  husky: 'tools',
  zustand: 'tools',

  // Testing
  vitest: 'testing',
  jest: 'testing',
  playwright: 'testing',
  'testing-library': 'testing',

  // Deployment
  docker: 'deployment',
  kubernetes: 'deployment',
  cloudflare: 'deployment',
};

function getCategoryFromName(name: string): TechItem['category'] {
  const lowerName = name.toLowerCase();
  for (const [keyword, category] of Object.entries(categoryRules)) {
    if (lowerName.includes(keyword)) return category;
  }
  return 'tools'; // 預設分類
}

function collectTechStack(): TechItem[] {
  console.log('🔍 開始收集技術堆疊...\n');

  const techMap = new Map<string, TechItem>();

  try {
    // 1. 獲取所有 nx 專案
    const projectsJson = execSync('nx show projects --json', {
      encoding: 'utf-8',
    });
    const projects: string[] = JSON.parse(projectsJson);

    console.log(`📦 找到 ${projects.length} 個專案\n`);

    // 2. 遍歷每個專案，讀取 package.json
    projects.forEach(project => {
      const packageJsonPath = resolve(process.cwd(), project, 'package.json');

      if (!existsSync(packageJsonPath)) {
        return; // 跳過沒有 package.json 的專案
      }

      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        const deps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies,
        };

        // 3. 提取技術堆疊
        Object.entries(deps).forEach(([name, version]) => {
          // 過濾掉 @types 和內部套件
          if (
            name.startsWith('@types/') ||
            name.startsWith('@nx-playground/')
          ) {
            return;
          }

          const category = getCategoryFromName(name);

          if (techMap.has(name)) {
            const item = techMap.get(name)!;
            item.projects.push(project);
          } else {
            techMap.set(name, {
              name,
              version: (version as string).replace(/[\^~]/, ''),
              category,
              projects: [project],
            });
          }
        });

        console.log(`✅ ${project}`);
      } catch (_error) {
        console.error(`❌ 無法讀取 ${project}/package.json`);
      }
    });

    // 4. 轉換為陣列並排序
    const techStack = Array.from(techMap.values()).sort((a, b) => {
      // 先按分類排序
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      // 同分類按使用專案數量排序
      return b.projects.length - a.projects.length;
    });

    console.log(`\n✨ 收集完成！共 ${techStack.length} 個技術\n`);
    console.log('📊 分類統計：');
    const categoryCounts = techStack.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    return techStack;
  } catch (error) {
    console.error('❌ 收集失敗:', error);
    return [];
  }
}

// 執行並輸出
const techStack = collectTechStack();
const outputPath = resolve(__dirname, '../src/lib/generated-tech-stack.ts');

const fileContent = `/**
 * 自動生成的技術堆疊資料
 * 由 scripts/collect-tech-stack.ts 生成
 *
 * 請勿手動編輯此檔案
 * 執行 \`pnpm run collect\` 重新生成
 */

import type { TechItem } from './types';

export const generatedTechStack: TechItem[] = ${JSON.stringify(
  techStack,
  null,
  2
)};
`;

writeFileSync(outputPath, fileContent);
console.log(`\n✅ 已生成: ${outputPath}`);
