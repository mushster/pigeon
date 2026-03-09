import type { Headline } from '../types';

function timeAgo(dateStr?: string): string | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0 || isNaN(diff)) return null;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface HeadlineItemProps {
  headline: Headline;
}

export function HeadlineItem({ headline }: HeadlineItemProps) {
  const ago = timeAgo(headline.pubDate);

  return (
    <li className="headline-item">
      <a href={headline.link} target="_blank" rel="noopener noreferrer">
        <span className="headline-title">{headline.title}</span>
        <span className="headline-meta">
          <span className="headline-source">{headline.source}</span>
          {ago && <span className="headline-time">{ago}</span>}
        </span>
      </a>
    </li>
  );
}
