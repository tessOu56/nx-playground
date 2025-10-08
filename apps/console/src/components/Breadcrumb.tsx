import { ChevronRight, Home } from 'lucide-react';
import { type FC, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  items = [],
  showHome = true,
}) => {
  const location = useLocation();

  // 如果沒有提供 items，根據當前路徑自動生成
  const breadcrumbItems =
    items.length > 0 ? items : generateBreadcrumbs(location.pathname);

  return (
    <nav className='flex items-center space-x-2 text-sm text-text-secondary'>
      {showHome && (
        <>
          <Link
            to='/dashboard'
            className='flex items-center space-x-1 hover:text-text-primary transition-colors'
          >
            <Home className='w-4 h-4' />
            <span>首頁</span>
          </Link>
          <ChevronRight className='w-4 h-4' />
        </>
      )}

      {breadcrumbItems.map((item, index) => (
        <Fragment key={`breadcrumb-${item.label}-${index}`}>
          {item.path ? (
            <Link
              to={item.path}
              className='hover:text-text-primary transition-colors'
            >
              {item.label}
            </Link>
          ) : (
            <span className='text-text-primary font-medium'>{item.label}</span>
          )}
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className='w-4 h-4' />
          )}
        </Fragment>
      ))}
    </nav>
  );
};

// 根據路徑自動生成麵包屑
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // 將路徑轉換為更友好的標籤
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // 最後一個項目不設路徑（當前頁面）
    const isLast = index === pathSegments.length - 1;

    breadcrumbs.push({
      label,
      path: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
