/**
 * Tech Stack Data
 * 合併自動生成和手動維護的技術堆疊資料
 */

import type { TechItem } from './types';
import { generatedTechStack } from './generated-tech-stack';
import { manualTechStack } from './manual-tech-stack';

/**
 * 合併技術堆疊資料
 * 優先使用手動維護的資料（包含 level, icon, color 等細節）
 */
const mergedStack = manualTechStack.map(manual => {
  const generated = generatedTechStack.find(g => g.name === manual.name);
  if (generated) {
    // 合併：手動資料為主，自動資料補充 version 和 projects
    return {
      ...manual,
      version: generated.version,
      projects: generated.projects,
    };
  }
  return manual;
});

// 添加自動收集但手動未維護的技術
generatedTechStack.forEach(generated => {
  if (!manualTechStack.some(m => m.name === generated.name)) {
    mergedStack.push(generated);
  }
});

export const techStack: TechItem[] = mergedStack;

// 導出類型和常數
export type { TechItem } from './types';
export { techCategories } from './types';
export { manualTechStack } from './manual-tech-stack';
