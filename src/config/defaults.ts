import type { UserConfig } from '../types';

const STORAGE_KEY = 'pigeon-config';

export const DEFAULT_CONFIG: UserConfig = {
  categories: [
    {
      id: 'world',
      label: 'World',
      feeds: [
        { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/worldNews' },
        { name: 'AP News', url: 'https://rsshub.app/apnews/topics/apf-topnews' },
      ],
    },
    {
      id: 'tech',
      label: 'Tech',
      feeds: [
        { name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
        { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
      ],
    },
    {
      id: 'business',
      label: 'Business',
      feeds: [
        { name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss' },
      ],
    },
  ],
  timer: {
    enabled: true,
    minutes: 10,
  },
};

export function loadConfig(): UserConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as UserConfig;
    }
  } catch {
    // corrupted data, fall back to defaults
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: UserConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
