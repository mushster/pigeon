interface TimerBarProps {
  secondsRemaining: number;
  isExpired: boolean;
  isRunning: boolean;
  enabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TimerBar({
  secondsRemaining,
  isExpired,
  isRunning,
  enabled,
  onStart,
  onPause,
  onReset,
}: TimerBarProps) {
  if (!enabled) return null;

  return (
    <div className={`timer-bar ${isExpired ? 'timer-bar--expired' : ''}`}>
      <span className="timer-display">
        {isExpired
          ? "Time\u2019s up."
          : `${formatTime(secondsRemaining)} remaining`}
      </span>
      <div className="timer-actions">
        {!isExpired && !isRunning && (
          <button onClick={onStart} className="timer-btn">
            {secondsRemaining > 0 ? 'Start' : 'Start'}
          </button>
        )}
        {isRunning && (
          <button onClick={onPause} className="timer-btn">Pause</button>
        )}
        <button onClick={onReset} className="timer-btn">Reset</button>
      </div>
    </div>
  );
}
