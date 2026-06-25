import { HABITS } from '../data/habits';

const CATEGORIES = [...new Set(HABITS.map((h) => h.category))];

export default function HabitsConfigModal({
  visibleHabits,
  onToggle,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-surface border border-border rounded-2xl p-6 w-full max-w-lg mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-text-primary font-semibold text-lg">
            Configurar hábitos
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="btn-close cursor-pointer text-text-muted"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {CATEGORIES.map((category) => (
            <div key={category}>
              <p className="text-text-muted text-xs font-medium mb-2 uppercase tracking-wider">
                {category}
              </p>
              <div className="flex flex-col gap-2">
                {HABITS.filter((h) => h.category === category).map((habit) => {
                  const isVisible = visibleHabits.has(habit.id);
                  const HabitIcon = habit.icon;

                  return (
                    <label
                      key={habit.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => onToggle(habit.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                          isVisible
                            ? 'bg-teal border-teal'
                            : 'bg-transparent border-border-muted group-hover:border-gray-500'
                        }`}
                      >
                        {isVisible && (
                          <svg
                            className="w-2.5 h-2.5 text-base"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M1.5 5l2.5 2.5 4.5-4.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HabitIcon className="size-4 text-primary" />
                        <span className="text-sm text-text-primary">
                          {habit.name}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
