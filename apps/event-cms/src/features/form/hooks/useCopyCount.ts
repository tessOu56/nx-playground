import { useState } from 'react';

export const useCopyCount = () => {
  const [copyCounts, setCopyCounts] = useState<Record<string, number>>({});

  const getCopyCount = (templateName: string): number => {
    return copyCounts[templateName] || 0;
  };

  const incrementCopyCount = (templateName: string): number => {
    const newCount = getCopyCount(templateName) + 1;
    setCopyCounts(prev => ({
      ...prev,
      [templateName]: newCount,
    }));
    return newCount;
  };

  const generateCopyName = (originalName: string): string => {
    const count = incrementCopyCount(originalName);
    return `複製的${originalName}(${count})`;
  };

  return {
    getCopyCount,
    incrementCopyCount,
    generateCopyName,
  };
};
