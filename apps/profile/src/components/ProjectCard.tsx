/**
 * 統一專案卡片組件
 * 用於 Apps、Libs 和搜尋結果的專案展示
 * 基於 LibCard 的精緻風格
 */

import { type FC } from 'react';

import type { AppData, LibData } from '../types/projectData';

import { CategoryBadge } from './CategoryBadge';
import { StatsRow } from './StatsRow';
import { StatusBadge } from './StatusBadge';
import { TechTag } from './TechTag';

interface ProjectCardProps {
  project: AppData | LibData;
  type: 'app' | 'lib';
  onClick?: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, type, onClick }) => {
  return (
    <div
      className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer'
      onClick={onClick}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            {project.name}
          </h3>
          {/* Libs 顯示 package name */}
          {type === 'lib' && (
            <code className='text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
              @nx-playground/{project.id}
            </code>
          )}
        </div>
        <div className='flex flex-col items-end gap-2'>
          <CategoryBadge category={project.category} type={type} />
          {project.status === 'coming-soon' && <StatusBadge status={project.status} />}
          {project.status === 'development' && <StatusBadge status={project.status} />}
          {project.version && (
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              v{project.version}
            </span>
          )}
        </div>
      </div>

      {/* Description（優先使用 shortDesc，fallback 到 description）*/}
      <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
        {project.shortDesc || project.description}
      </p>

      {/* Tech Stack */}
      <div className='mb-4'>
        <div className='flex flex-wrap gap-2'>
          {project.techStack.slice(0, 4).map(tech => (
            <TechTag key={tech} name={tech} compact />
          ))}
          {project.techStack.length > 4 && (
            <span className='px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium'>
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Stats（Libs 專用）*/}
      {type === 'lib' && project.stats && <StatsRow stats={project.stats} />}

      {/* Highlights */}
      <div>
        <h4 className='font-semibold text-gray-900 dark:text-white mb-2 text-sm'>
          Highlights:
        </h4>
        <ul className='space-y-1'>
          {project.highlights.slice(0, 4).map((highlight, index) => (
            <li
              key={index}
              className='text-sm text-gray-600 dark:text-gray-400 flex items-start'
            >
              <span className='text-green-600 dark:text-green-400 mr-2'>✓</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

