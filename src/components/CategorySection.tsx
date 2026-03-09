import type { Headline } from '../types';
import { HeadlineItem } from './HeadlineItem';

interface CategorySectionProps {
  label: string;
  headlines: Headline[];
  loading: boolean;
}

export function CategorySection({ label, headlines, loading }: CategorySectionProps) {
  return (
    <section className="category-section">
      <h2 className="category-label">{label}</h2>
      {loading && headlines.length === 0 ? (
        <p className="category-loading">Loading&hellip;</p>
      ) : headlines.length === 0 ? (
        <p className="category-empty">No headlines available.</p>
      ) : (
        <ul className="headline-list">
          {headlines.map((h, i) => (
            <HeadlineItem key={`${h.link}-${i}`} headline={h} />
          ))}
        </ul>
      )}
    </section>
  );
}
