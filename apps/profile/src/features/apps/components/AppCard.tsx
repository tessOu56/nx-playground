import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProjectCard } from '../../../components/ProjectCard';
import type { AppData } from '../../../types/projectData';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';

interface AppCardProps {
  app: AppData;
}

export const AppCard: FC<AppCardProps> = ({ app }) => {
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedNavigation();

  const handleClick = () => {
    navigate(getLocalizedPath(`/apps/${app.id}`));
  };

  return <ProjectCard project={app} type='app' onClick={handleClick} />;
};
