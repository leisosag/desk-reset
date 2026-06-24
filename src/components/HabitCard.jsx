import { INTERVAL_OPTIONS } from '../data/habits';

export default function HabitCard({
  habit,
  enabled,
  interval,
  onToggle,
  onIntervalChange,
}) {
  const { id, icon, name, description } = habit;

  return (
    <div
      className={`bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 transition-opacity duration-200 ${!enabled ? 'opacity-45' : ''}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-text-primary font-semibold text-lg">{name}</div>
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

      {/* Timer ring + interval selector */}
      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative w-[72px] h-[72px] flex-shrink-0">
          <svg
            width={72}
            height={72}
            style={{ transform: 'rotate(-90deg)' }}
            aria-hidden="true"
          >
            <circle
              cx={36}
              cy={36}
              r={33}
              fill="none"
              stroke="#252836"
              strokeWidth={3}
            />
            <circle
              cx={36}
              cy={36}
              r={33}
              fill="none"
              stroke="#2dd4bf33"
              strokeWidth={3}
              strokeDasharray={207}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-text-muted">
            {String(interval).padStart(2, '0')}:00
          </div>
        </div>

        {/* Interval selector */}
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
                    : 'border-border-muted bg-transparent text-text-muted hover:border-gray-500 hover:text-text-secondary'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
