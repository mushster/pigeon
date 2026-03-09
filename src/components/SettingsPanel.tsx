import { useState } from 'react';
import type { UserConfig } from '../types';
import { DEFAULT_CONFIG } from '../config/defaults';

interface SettingsPanelProps {
  config: UserConfig;
  onSave: (config: UserConfig) => void;
  onClose: () => void;
}

export function SettingsPanel({ config, onSave, onClose }: SettingsPanelProps) {
  const [draft, setDraft] = useState<UserConfig>(structuredClone(config));
  const [newCategoryName, setNewCategoryName] = useState('');

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setDraft({
      ...draft,
      categories: [...draft.categories, { id, label: name, feeds: [] }],
    });
    setNewCategoryName('');
  }

  function removeCategory(id: string) {
    setDraft({
      ...draft,
      categories: draft.categories.filter((c) => c.id !== id),
    });
  }

  function addFeed(categoryId: string, name: string, url: string) {
    setDraft({
      ...draft,
      categories: draft.categories.map((c) =>
        c.id === categoryId
          ? { ...c, feeds: [...c.feeds, { name, url }] }
          : c
      ),
    });
  }

  function removeFeed(categoryId: string, feedIndex: number) {
    setDraft({
      ...draft,
      categories: draft.categories.map((c) =>
        c.id === categoryId
          ? { ...c, feeds: c.feeds.filter((_, i) => i !== feedIndex) }
          : c
      ),
    });
  }

  function handleSave() {
    onSave(draft);
    onClose();
  }

  function handleReset() {
    setDraft(structuredClone(DEFAULT_CONFIG));
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="settings-close">&times;</button>
        </div>

        <div className="settings-body">
          <h3>Reading Timer</h3>
          <div className="settings-row">
            <label>
              <input
                type="checkbox"
                checked={draft.timer.enabled}
                onChange={(e) =>
                  setDraft({ ...draft, timer: { ...draft.timer, enabled: e.target.checked } })
                }
              />
              Enable timer
            </label>
            <label>
              Minutes:
              <input
                type="number"
                min={1}
                max={60}
                value={draft.timer.minutes}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    timer: { ...draft.timer, minutes: parseInt(e.target.value) || 10 },
                  })
                }
                className="settings-number"
              />
            </label>
          </div>

          <h3>Categories &amp; Feeds</h3>
          {draft.categories.map((cat) => (
            <CategoryEditor
              key={cat.id}
              category={cat}
              onRemoveCategory={() => removeCategory(cat.id)}
              onAddFeed={(name, url) => addFeed(cat.id, name, url)}
              onRemoveFeed={(i) => removeFeed(cat.id, i)}
            />
          ))}

          <div className="settings-add-category">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory}>Add Category</button>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={handleReset} className="settings-btn-secondary">
            Reset to Defaults
          </button>
          <button onClick={handleSave} className="settings-btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryEditor({
  category,
  onRemoveCategory,
  onAddFeed,
  onRemoveFeed,
}: {
  category: UserConfig['categories'][number];
  onRemoveCategory: () => void;
  onAddFeed: (name: string, url: string) => void;
  onRemoveFeed: (index: number) => void;
}) {
  const [feedName, setFeedName] = useState('');
  const [feedUrl, setFeedUrl] = useState('');

  function handleAdd() {
    if (feedName.trim() && feedUrl.trim()) {
      onAddFeed(feedName.trim(), feedUrl.trim());
      setFeedName('');
      setFeedUrl('');
    }
  }

  return (
    <div className="settings-category">
      <div className="settings-category-header">
        <strong>{category.label}</strong>
        <button onClick={onRemoveCategory} className="settings-remove">&times;</button>
      </div>
      <ul className="settings-feed-list">
        {category.feeds.map((feed, i) => (
          <li key={i}>
            <span>{feed.name}</span>
            <span className="settings-feed-url">{feed.url}</span>
            <button onClick={() => onRemoveFeed(i)} className="settings-remove">&times;</button>
          </li>
        ))}
      </ul>
      <div className="settings-add-feed">
        <input
          type="text"
          placeholder="Feed name"
          value={feedName}
          onChange={(e) => setFeedName(e.target.value)}
        />
        <input
          type="url"
          placeholder="Feed URL"
          value={feedUrl}
          onChange={(e) => setFeedUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
