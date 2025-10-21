import { type FC } from 'react';

import { type TechItem } from '../data/techStack';

interface TechBadgeProps {
  tech: TechItem;
  levelLabel: string;
}

export const TechBadge: FC<TechBadgeProps> = ({ tech, levelLabel }) => {
  const getLevelClass = (level: TechItem['level']) => {
    switch (level) {
      case 'expert':
        return 'bg-[hsl(var(--badge-expert))] text-white hover:bg-[hsl(var(--badge-expert))]/90';
      case 'advanced':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      case 'intermediate':
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  const content = (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${getLevelClass(
        tech.level
      )}`}
      title={levelLabel}
    >
      {tech.name}
    </span>
  );

  return tech.url ? (
    <a
      href={tech.url}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-block'
    >
      {content}
    </a>
  ) : (
    content
  );
};

