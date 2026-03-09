import Parser from 'rss-parser';
import type { Category, FeedSource, Headline } from '../types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const MAX_HEADLINES_PER_CATEGORY = 15;

const parser = new Parser();

export async function fetchFeed(feed: FeedSource): Promise<Headline[]> {
  const proxiedUrl = CORS_PROXY + encodeURIComponent(feed.url);
  const response = await fetch(proxiedUrl);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  const result = await parser.parseString(xml);

  return (result.items || []).map((item) => ({
    title: item.title || 'Untitled',
    link: item.link || '#',
    source: feed.name,
    pubDate: item.pubDate || item.isoDate,
  }));
}

export async function fetchCategory(category: Category): Promise<Headline[]> {
  const results = await Promise.allSettled(
    category.feeds.map((feed) => fetchFeed(feed))
  );

  const headlines: Headline[] = [];
  const seenLinks = new Set<string>();

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const headline of result.value) {
        if (!seenLinks.has(headline.link)) {
          seenLinks.add(headline.link);
          headlines.push(headline);
        }
      }
    } else {
      console.warn(`Feed fetch failed:`, result.reason);
    }
  }

  headlines.sort((a, b) => {
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return headlines.slice(0, MAX_HEADLINES_PER_CATEGORY);
}
