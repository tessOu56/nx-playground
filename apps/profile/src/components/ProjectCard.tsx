/**
 * 統一專案卡片組件
 * 用於 Apps、Libs 和搜尋結果的專案展示
 * 基於 LibCard 的精緻風格
 */

import { type FC } from 'react';

import type { AppData, LibData } from '../types/projectData';

import { CategoryBadge } from './CategoryBadge';
import { StatusBadge } from './StatusBadge';
import { TechTag } from './TechTag';

interface ProjectCardProps {
  project: AppData | LibData;
  type: 'app' | 'lib';
  onClick?: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  type,
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col'
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`View ${project.name} details`}
    >
      {/* Header - 4rem fixed height */}
      <div className='flex items-start justify-between mb-3' style={{ minHeight: '4rem' }}>
        <div className='flex-1 min-w-0'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-1'>
            {project.name}
          </h3>
          {project.category && <CategoryBadge category={project.category} type={type} />}
        </div>
        {project.version && (
          <span className='text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap'>
            v{project.version}
          </span>
        )}
      </div>

      {/* Description - 3rem fixed height (2 lines) */}
      <div style={{ minHeight: '3rem' }} className='mb-3'>
        <p className='text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed'>
          {project.description || 'No description available'}
        </p>
      </div>

      {/* Tech Stack - 5rem fixed height */}
      <div style={{ minHeight: '5rem' }} className='mt-auto'>
        {project.techStack && project.techStack.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {project.techStack.slice(0, 4).map(tech => (
              <TechTag key={tech} name={tech} compact />
            ))}
            {project.techStack.length > 4 && (
              <span className='px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium'>
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
