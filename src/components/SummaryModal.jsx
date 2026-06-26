import { HABITS } from '../data/habits';
import { X } from '@phosphor-icons/react';

export default function SummaryModal({ habitStates, onClose }) {
  const totalCompleted = Object.values(habitStates).reduce(
    (acc, s) => acc + s.completedToday,
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-surface border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-text-primary font-semibold text-xl">
              Resumen del día
            </h2>
            <p className="text-text-muted text-xs mt-0.5">
              {totalCompleted} hábito{totalCompleted !== 1 ? 's' : ''}{' '}
              completado{totalCompleted !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-close cursor-pointer text-text-muted"
            aria-label="Cerrar resumen"
          >
            <X />
          </button>
        </div>

        {/* Lista de hábitos */}
        <div className="flex flex-col gap-3">
          {HABITS.map((habit) => {
            const count = habitStates[habit.id]?.completedToday ?? 0;
            const enabled = habitStates[habit.id]?.enabled;
            const HabitIcon = habit.icon;

            return (
              <div
                key={habit.id}
                className={`flex items-center justify-between ${!enabled ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <HabitIcon className="size-4 text-primary" />
                  <span className="text-text-primary text-sm">
                    {habit.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-sm font-semibold ${count > 0 ? 'text-teal' : 'text-text-muted'}`}
                  >
                    {count}
                  </span>
                  <span className="text-text-muted text-xs">
                    {count === 1 ? 'vez' : 'veces'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider + mensaje */}
        <div className="h-px bg-border my-5" />
        <p className="font-mono text-xs text-text-muted text-center">
          {totalCompleted === 0
            ? 'Mañana es otro día 💪'
            : totalCompleted < 5
              ? '¡Buen comienzo!'
              : '¡Excelente jornada!'}
        </p>

        <button onClick={onClose} className="btn-primary w-full mt-4">
          Cerrar
        </button>
      </div>
    </div>
  );
}
