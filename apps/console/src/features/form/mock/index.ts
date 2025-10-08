import { MockDataManager } from './mockDataManager';

export { MockDataManager } from './mockDataManager';
export { mockTemplates, mockTemplateDetails, fieldTypes } from './data';

// 重新導出服務函數以保持向後兼容
export const getFormTemplates = MockDataManager.getTemplates;
export const getFormTemplate = MockDataManager.getTemplate;
export const createFormTemplate = MockDataManager.createTemplate;
export const copyFormTemplate = MockDataManager.copyTemplate;
export const updateFormTemplate = MockDataManager.updateTemplate;
export const deleteFormTemplate = MockDataManager.deleteTemplate;
export const renameFormTemplate = MockDataManager.renameTemplate;
