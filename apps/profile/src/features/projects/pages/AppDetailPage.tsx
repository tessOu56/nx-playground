import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { SupportedLocale } from '../../../lib/i18n/LocaleRouter';
import { APP_IDS, LIB_IDS } from '../../../lib/projectList';
import { loadApp, loadLib } from '../../../lib/projectLoader';
import type { AppData, LibData } from '../../../types/projectData';
import { ProjectDetail } from '../components/ProjectDetail';

export const AppDetailPage: FC = () => {
  const { appId, projectId, locale } = useParams<{ appId?: string; projectId?: string; locale: string }>();
  const id = projectId || appId;
  const currentLocale = (locale ?? 'en') as SupportedLocale;
  const [project, setProject] = useState<AppData | LibData | null>(null);
  const [projectType, setProjectType] = useState<'app' | 'lib'>('app');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Determine if it's an app or lib
        const isLib = LIB_IDS.includes(id as typeof LIB_IDS[number]);
        const isApp = APP_IDS.includes(id as typeof APP_IDS[number]);

        let data: AppData | LibData | null = null;

        if (isLib) {
          data = await loadLib(id, currentLocale);
          setProjectType('lib');
        } else if (isApp) {
          data = await loadApp(id, currentLocale);
          setProjectType('app');
        }

        setProject(data);
      } catch (error) {
        console.error('Failed to load project:', error);
        setProject(null);
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

  if (!project) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>Project not found</p>
      </div>
    );
  }

  return <ProjectDetail key={`${id}-${currentLocale}`} project={project} type={projectType} />;
};
