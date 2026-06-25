import CircularProgress from './CircularProgress';
import { formatTime } from '../utils/time';
import { INTERVAL_OPTIONS } from '../data/habits';

const SNOOZE_MINUTES = 5;

export default function HabitCard({
  habit,
  state,
  onToggle,
  onIntervalChange,
  onDone,
  onSnooze,
  activeHours,
  isActiveHours,
}) {
  const { id, icon, name, description } = habit;
  const { enabled, interval, remaining, snoozed } = state;

  const total = interval * 60;
  const progress = total > 0 ? 1 - remaining / total : 0;
  const isUrgent = enabled && remaining < 60 && remaining > 0;
  const isDue = enabled && remaining === 0;

  const ringColor = isDue ? '#2dd4bf' : isUrgent ? '#99f6e4' : '#2dd4bf33';
  const timerColorClass = isDue
    ? 'text-teal'
    : isUrgent
      ? 'text-teal-light'
      : 'text-text-muted';

  const HabitIcon = habit.icon;

  return (
    <div
      className={[
        'bg-surface rounded-xl p-5 flex flex-col gap-4 transition-all duration-300 border',
        isDue
          ? 'border-teal shadow-[0_0_16px_rgba(45,212,191,0.12)]'
          : 'border-border',
        !enabled ? 'opacity-45' : '',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <HabitIcon className="size-5 text-primary mb-1" />
          <div className="text-text-primary font-semibold text-sm">{name}</div>
          <div className="text-text-muted text-xs mt-0.5">{description}</div>
        </div>

        <button
          onClick={() => onToggle(id)}
          role="switch"
          aria-checked={enabled}
          aria-label={`${enabled ? 'Desactivar' : 'Activar'} ${name}`}
          className="relative flex-shrink-0 w-10 h-[22px] rounded-full border-none cursor-pointer transition-colors duration-200"
          style={{ background: enabled ? '#2dd4bf' : '#374151' }}
        >
          <div
            className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200"
            style={{ left: enabled ? 21 : 3 }}
          />
        </button>
      </div>

      {/* Ring + interval selector */}
      <div className="flex items-center gap-4">
        <div className="relative w-[72px] h-[72px] flex-shrink-0">
          <CircularProgress progress={progress} color={ringColor} />
          <div
            className={`absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold ${timerColorClass}`}
          >
            {!isActiveHours ? (
              <span className="text-[10px] text-text-muted text-center leading-tight px-1">
                Retoma
                <br />a las {activeHours.start}
              </span>
            ) : enabled ? (
              isDue ? (
                '¡Ya!'
              ) : (
                formatTime(remaining)
              )
            ) : (
              '--:--'
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-text-muted text-xs mb-1.5">Cada</div>
          <div className="flex gap-1 flex-wrap">
            {INTERVAL_OPTIONS.map((min) => (
              <button
                key={min}
                onClick={() => onIntervalChange(id, min)}
                className={`px-2 py-1 rounded text-xs border cursor-pointer transition-all duration-150 ${
                  min === interval
                    ? 'border-teal bg-teal-bg text-teal'
                    : 'border-border-muted bg-transparent text-text-muted hover:border-gray-500'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions when due */}
      {isDue && (
        <div className="flex gap-2">
          <button onClick={() => onDone(id)} className="btn-primary">
            ✓ Listo
          </button>
          <button
            onClick={() => onSnooze(id)}
            className="btn-secondary text-text-secondary"
          >
            +{SNOOZE_MINUTES} min
          </button>
        </div>
      )}

      {snoozed && (
        <div className="text-xs text-text-muted text-center">
          Pospuesto {SNOOZE_MINUTES} min
        </div>
      )}
    </div>
  );
}
