import { useCallback, useEffect, useState } from 'react';
import type { UserConfig } from './types';
import { loadConfig, saveConfig } from './config/defaults';
import { useFeeds } from './hooks/useFeeds';
import { useTimer } from './hooks/useTimer';
import { Masthead } from './components/Masthead';
import { TimerBar } from './components/TimerBar';
import { CategorySection } from './components/CategorySection';
import { SettingsPanel } from './components/SettingsPanel';
import './App.css';

export default function App() {
  const [config, setConfig] = useState<UserConfig>(loadConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { headlines, loading, error, refresh } = useFeeds(config.categories);
  const timer = useTimer(config.timer);

  // Auto-start timer when feeds finish loading
  useEffect(() => {
    if (!loading && config.timer.enabled && !timer.isRunning && timer.secondsRemaining > 0) {
      timer.start();
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveConfig = useCallback((newConfig: UserConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
    setDismissed(false);
  }, []);

  return (
    <div className="app">
      <Masthead
        onRefresh={refresh}
        onToggleSettings={() => setShowSettings((s) => !s)}
        loading={loading}
      />

      <TimerBar
        secondsRemaining={timer.secondsRemaining}
        isExpired={timer.isExpired}
        isRunning={timer.isRunning}
        enabled={config.timer.enabled}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={() => {
          timer.reset();
          setDismissed(false);
        }}
      />

      {error && <p className="error-message">{error}</p>}

      <main className="categories">
        {config.categories.map((cat) => (
          <CategorySection
            key={cat.id}
            label={cat.label}
            headlines={headlines.get(cat.id) || []}
            loading={loading}
          />
        ))}
      </main>

      {timer.isExpired && !dismissed && (
        <div className="time-up-overlay">
          <div className="time-up-content">
            <h2>That&rsquo;s enough news for now.</h2>
            <p>Go make something, take a walk, or just be.</p>
            <button onClick={() => setDismissed(true)} className="time-up-dismiss">
              Read a little more
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsPanel
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
