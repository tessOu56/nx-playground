import { htmlToPlainText } from './html-to-plain-text';

export type RssItem = {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  description: string;
  content: string;
};

function innerTag(block: string, tag: string): string {
  const match = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i')
  );
  return match ? unwrapCdata(match[1]) : '';
}

function unwrapCdata(value: string): string {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function firstTag(block: string, tags: string[]): string {
  for (const tag of tags) {
    const value = innerTag(block, tag);
    if (value) return value;
  }
  return '';
}

export function parseRssItems(xml: string): RssItem[] {
  if (typeof xml !== 'string' || !xml.includes('<item')) return [];
  const items: RssItem[] = [];
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRe.exec(xml))) {
    const block = match[1];
    const title = htmlToPlainText(firstTag(block, ['title']));
    const link = htmlToPlainText(firstTag(block, ['link']));
    const guid = htmlToPlainText(firstTag(block, ['guid'])) || link;
    if (!title || !link) continue;
    items.push({
      title,
      link,
      guid,
      pubDate: htmlToPlainText(firstTag(block, ['pubDate'])),
      description: firstTag(block, ['description']),
      content: firstTag(block, ['content:encoded', 'content']),
    });
  }
  return items;
}
