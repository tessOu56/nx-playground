import Script from 'next/script';

// 組織結構化資料
export const OrganizationJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NX Playground',
    url: 'https://nx-playground.local',
    logo: 'https://events.nx-playground.local/logo.png',
    description: '專業的活動管理平台',
    sameAs: ['https://twitter.com/nx-playground', 'https://facebook.com/nx-playground'],
  };

  return (
    <Script
      id='organization-jsonld'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// Web 應用結構化資料
export const WebApplicationJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NX Playground Events',
    description: '基於 LIFF 的活動管理平台',
    url: 'https://events.nx-playground.local',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TWD',
    },
  };

  return (
    <Script
      id='webapplication-jsonld'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// 活動結構化資料
export const EventJsonLd = ({ event }: { event: any }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date,
    endDate: event.date,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: '台北市',
        addressCountry: 'TW',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'NX Playground',
    },
    offers: {
      '@type': 'Offer',
      price: event.price === '免費' ? '0' : event.price,
      priceCurrency: 'TWD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <Script
      id='event-jsonld'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// 麵包屑結構化資料
export const BreadcrumbJsonLd = ({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id='breadcrumb-jsonld'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// 網站結構化資料
export const WebsiteJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NX Playground Events',
    url: 'https://events.nx-playground.local',
    description: '基於 LIFF 的活動管理平台',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://events.nx-playground.local/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id='website-jsonld'
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
