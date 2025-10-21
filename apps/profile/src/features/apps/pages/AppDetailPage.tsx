import { type FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { appsConfig } from '../../../data/apps.config';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';
import { AppDetail } from '../components';

export const AppDetailPage: FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const { getLocalizedPath } = useLocalizedNavigation();

  const app = appsConfig.find(a => a.id === appId);

  if (!app) {
    return <Navigate to={getLocalizedPath('/apps')} replace />;
  }

  return <AppDetail app={app} />;
};

