import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { loadLib } from '../../../lib/projectLoader';
import type { LibData } from '../../../types/projectData';
import { ProjectDetail } from '../components/ProjectDetail';

export const LibDetailPage: FC = () => {
  const { libId, projectId, locale } = useParams<{ libId?: string; projectId?: string; locale: string }>();
  const id = projectId || libId;
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [lib, setLib] = useState<LibData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadLib(id, currentLocale);
        setLib(data);
      } catch (error) {
        console.error('Failed to load lib:', error);
        setLib(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentLocale]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  if (!lib) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>Library not found</p>
      </div>
    );
  }

  return <ProjectDetail project={lib} type='lib' />;
};
