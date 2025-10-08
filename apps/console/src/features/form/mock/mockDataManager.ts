import { type FormTemplate, type FormTemplateListItem } from '../types';

import { mockTemplates, mockTemplateDetails } from './data';

// 模擬數據存儲（可變的副本）
let templates: FormTemplateListItem[] = [...mockTemplates];
let templateDetails: Record<string, FormTemplate> = { ...mockTemplateDetails };

// 生成新的 ID
const generateId = () =>
  `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 模擬 API 延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDataManager {
  // 獲取模板列表
  static async getTemplates(): Promise<FormTemplateListItem[]> {
    await delay(500);
    return [...templates];
  }

  // 獲取模板詳情
  static async getTemplate(id: string): Promise<FormTemplate> {
    await delay(300);
    const template = templateDetails[id];
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  // 創建新模板
  static async createTemplate(name: string): Promise<FormTemplate> {
    await delay(800);

    const newId = generateId();
    const now = new Date().toISOString();

    const newTemplate: FormTemplate = {
      id: newId,
      name,
      fields: [],
      submitText: '送出',
      createdAt: now,
      updatedAt: now,
    };

    const newTemplateListItem: FormTemplateListItem = {
      id: newId,
      name,
      fields: [],
      createdAt: now,
      updatedAt: now,
    };

    // 添加到模擬數據
    templates.push(newTemplateListItem);
    templateDetails[newId] = newTemplate;

    return newTemplate;
  }

  // 複製模板
  static async copyTemplate(
    sourceId: string,
    name: string
  ): Promise<FormTemplate> {
    await delay(800);

    const sourceTemplate = templateDetails[sourceId];
    if (!sourceTemplate) {
      throw new Error('Source template not found');
    }

    const newId = generateId();
    const now = new Date().toISOString();

    const copiedTemplate: FormTemplate = {
      ...sourceTemplate,
      id: newId,
      name,
      fields: sourceTemplate.fields.map(field => ({
        ...field,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })),
      createdAt: now,
      updatedAt: now,
    };

    const copiedTemplateListItem: FormTemplateListItem = {
      id: newId,
      name,
      fields: sourceTemplate.fields.map(field => ({
        ...field,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })),
      createdAt: now,
      updatedAt: now,
    };

    // 添加到模擬數據
    templates.push(copiedTemplateListItem);
    templateDetails[newId] = copiedTemplate;

    return copiedTemplate;
  }

  // 更新模板
  static async updateTemplate(
    id: string,
    updates: Partial<FormTemplate>
  ): Promise<FormTemplate> {
    await delay(500);

    const template = templateDetails[id];
    if (!template) {
      throw new Error('Template not found');
    }

    const updatedTemplate: FormTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 更新模擬數據
    templateDetails[id] = updatedTemplate;

    // 更新列表中的模板
    const templateIndex = templates.findIndex(t => t.id === id);
    if (templateIndex !== -1) {
      templates[templateIndex] = {
        ...templates[templateIndex],
        ...updates,
        updatedAt: updatedTemplate.updatedAt,
      };
    }

    return updatedTemplate;
  }

  // 刪除模板
  static async deleteTemplate(id: string): Promise<void> {
    await delay(500);

    const templateIndex = templates.findIndex(t => t.id === id);
    if (templateIndex === -1) {
      throw new Error('Template not found');
    }

    // 從模擬數據中移除
    templates.splice(templateIndex, 1);
    delete templateDetails[id];
  }

  // 重新命名模板
  static async renameTemplate(
    id: string,
    newName: string
  ): Promise<FormTemplate> {
    return MockDataManager.updateTemplate(id, { name: newName });
  }

  // 重置數據到初始狀態
  static resetData(): void {
    templates = [...mockTemplates];
    templateDetails = { ...mockTemplateDetails };
  }

  // 獲取當前數據狀態（用於調試）
  static getCurrentState() {
    return {
      templates: [...templates],
      templateDetails: { ...templateDetails },
    };
  }
}
