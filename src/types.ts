export interface FeedSource {
  url: string;
  name: string;
}

export interface Category {
  id: string;
  label: string;
  feeds: FeedSource[];
}

export interface Headline {
  title: string;
  link: string;
  source: string;
  pubDate?: string;
}

export interface TimerConfig {
  enabled: boolean;
  minutes: number;
}

export interface UserConfig {
  categories: Category[];
  timer: TimerConfig;
}
