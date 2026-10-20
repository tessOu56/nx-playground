import { CatalogEmpty } from './CatalogEmpty';

export function NoEvents({ locale = 'zh-TW' }: { locale?: string }) {
  return (
    <CatalogEmpty
      kind='catalog'
      locale={locale}
      query={{ q: '', city: 'all', dates: 'all', category: '' }}
    />
  );
}
