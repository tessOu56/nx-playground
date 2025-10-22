import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { loadApp } from '../../../lib/projectLoader';
import type { AppData } from '../../../types/projectData';
import { ProjectDetail } from '../components/ProjectDetail';

export const AppDetailPage: FC = () => {
  const { appId, projectId, locale } = useParams<{ appId?: string; projectId?: string; locale: string }>();
  const id = projectId || appId;
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await loadApp(id, currentLocale);
        setApp(data);
      } catch (error) {
        console.error('Failed to load app:', error);
        setApp(null);
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

  if (!app) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>App not found</p>
      </div>
    );
  }

  return <ProjectDetail project={app} type='app' />;
};
