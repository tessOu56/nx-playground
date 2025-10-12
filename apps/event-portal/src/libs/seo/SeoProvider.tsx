import {
  OrganizationJsonLd,
  WebApplicationJsonLd,
  WebsiteJsonLd,
} from './JsonLd';

export function SeoProvider() {
  return (
    <>
      <OrganizationJsonLd />
      <WebApplicationJsonLd />
      <WebsiteJsonLd />
    </>
  );
}
