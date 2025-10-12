import { PageNumberBreadcrumb } from './PageNumberBreadcrumb';

export function Header() {
  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <PageNumberBreadcrumb />
    </header>
  );
}
