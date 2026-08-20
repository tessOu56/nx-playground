import { PageNumberBreadcrumb } from './PageNumberBreadcrumb';

export function Header() {
  return (
    <header className='sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200'>
      <PageNumberBreadcrumb />
    </header>
  );
}
