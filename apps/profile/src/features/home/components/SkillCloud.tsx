import { techCategories, techStack } from '@nx-playground/tech-stack-data';
import { type FC, useMemo } from 'react';

import { TechTag } from '../../../components/TechTag';
import { useHomeTranslation } from '../hooks/useHomeTranslation';
import '../i18n';

export const SkillCloud: FC = () => {
  const { t, i18n } = useHomeTranslation();
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
            {t('skills.title')}
          </h2>
          <p className='text-lg text-muted-foreground'>
            {t('skills.subtitle')}
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
                  <TechTag key={tech.name} name={tech.name} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info text */}
        <div className='mt-12 text-center'>
          <p className='text-sm text-muted-foreground'>
            {t('skills.searchHint')}
          </p>
        </div>
      </div>
    </section>
  );
};
