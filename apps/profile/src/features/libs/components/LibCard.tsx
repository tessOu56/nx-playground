import { type FC } from 'react';

import { ProjectCard } from '../../../components/ProjectCard';
import type { LibData } from '../../../types/projectData';

interface LibCardProps {
  lib: LibData;
}

export const LibCard: FC<LibCardProps> = ({ lib }) => {
  // Libs 暫時不需要點擊跳轉，因為還沒有詳情頁
  // 未來可以添加 navigate 到 /libs/{libId}
  return <ProjectCard project={lib} type='lib' />;
};
