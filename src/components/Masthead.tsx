interface MastheadProps {
  onRefresh: () => void;
  onToggleSettings: () => void;
  loading: boolean;
}

export function Masthead({ onRefresh, onToggleSettings, loading }: MastheadProps) {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <h1 className="masthead-title">PIGEON</h1>
        <p className="masthead-date">{today}</p>
        <div className="masthead-actions">
          <button onClick={onRefresh} disabled={loading} className="masthead-btn">
            {loading ? 'Loading\u2026' : 'Refresh'}
          </button>
          <button onClick={onToggleSettings} className="masthead-btn">
            Settings
          </button>
        </div>
      </div>
    </header>
  );
}
