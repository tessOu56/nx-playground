/**
 * 统一的技术标签组件
 * 用于 Home 技能、Apps 技术栈、Libs 技术栈、Blog 标签
 * 点击后跳转到站内搜索页面
 */

import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCategoryColorClasses, getTechCategory } from '../lib/techCategories';
import { useLocalizedNavigation } from '../lib/i18n/useLocalizedNavigation';

interface TechTagProps {
  /**
   * 技术名称
   */
  name: string;
  /**
   * 是否为紧凑模式（更小的内边距）
   */
  compact?: boolean;
  /**
   * 是否显示为内联块
   */
  inline?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
}

export const TechTag: FC<TechTagProps> = ({
  name,
  compact = false,
  inline = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();

  // 获取技术分类和对应的颜色
  const category = getTechCategory(name);
  const colorClasses = getCategoryColorClasses(category);

  // 点击处理：跳转到搜索页面并预填标签
  const handleClick = () => {
    // 跳转到 blog 页面（搜索页面），通过 URL 参数传递标签
    navigate(`${getLocalizedPath('/blog')}?tag=${encodeURIComponent(name)}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center rounded-md font-medium 
        border transition-all duration-200
        cursor-pointer select-none
        ${compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'}
        ${colorClasses.bg}
        ${colorClasses.text}
        ${colorClasses.border}
        ${colorClasses.hover}
        hover:scale-105 hover:shadow-sm
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
        ${inline ? '' : ''}
        ${className}
      `}
      title={`搜尋 ${name} 相關文件`}
      type="button"
    >
      {name}
    </button>
  );
};

