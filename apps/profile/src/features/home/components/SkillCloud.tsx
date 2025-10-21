import { useTranslation } from '@nx-playground/i18n';
import { type FC, useMemo } from 'react';

import { TechBadge } from '../../../components/TechBadge';
import { techCategories, techLevels, techStack } from '../../../data/techStack';
import { useHomeTranslation } from '../hooks/useHomeTranslation';

export const SkillCloud: FC = () => {
  const { t } = useHomeTranslation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'zh-TW' | 'en';

  const groupedTech = useMemo(() => {
    const grouped: Record<string, typeof techStack> = {};
    techStack.forEach(tech => {
      if (!grouped[tech.category]) {
        grouped[tech.category] = [];
      }
      grouped[tech.category].push(tech);
    });
    return grouped;
  }, []);

  return (
    <section className='container mx-auto px-4 py-16 md:py-20'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-foreground mb-4'>
            {String(t('skills.title'))}
          </h2>
          <p className='text-lg text-muted-foreground'>
            {String(t('skills.subtitle'))}
          </p>
        </div>

        {/* Tech categories */}
        <div className='space-y-12'>
          {Object.entries(groupedTech).map(([category, items]) => (
            <div key={category}>
              <h3 className='text-2xl font-semibold text-foreground mb-6'>
                {
                  techCategories[category as keyof typeof techCategories][
                    currentLang
                  ]
                }
              </h3>
              <div className='flex flex-wrap gap-3'>
                {items.map(tech => (
                  <TechBadge
                    key={tech.name}
                    tech={tech}
                    levelLabel={techLevels[tech.level][currentLang]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className='mt-12 flex justify-center gap-6 flex-wrap'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-[hsl(var(--badge-expert))]' />
            <span className='text-sm text-muted-foreground'>
              {techLevels.expert[currentLang]}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-secondary' />
            <span className='text-sm text-muted-foreground'>
              {techLevels.advanced[currentLang]}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-muted' />
            <span className='text-sm text-muted-foreground'>
              {techLevels.intermediate[currentLang]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
