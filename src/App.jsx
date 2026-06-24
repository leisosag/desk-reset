import { useState } from 'react';
import { HABITS } from './data/habits';
import HabitCard from './components/HabitCard';

function buildInitialState(habits) {
  return Object.fromEntries(
    habits.map((h) => [
      h.id,
      {
        enabled: h.defaultEnabled,
        interval: h.defaultInterval,
      },
    ]),
  );
}

export default function App() {
  const [habitStates, setHabitStates] = useState(() =>
    buildInitialState(HABITS),
  );

  const handleToggle = (id) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  };

  const handleIntervalChange = (id, minutes) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], interval: minutes },
    }));
  };

  const enabledCount = Object.values(habitStates).filter(
    (s) => s.enabled,
  ).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Desk Reset
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {enabledCount} activo{enabledCount !== 1 ? 's' : ''}
        </p>
        <div className="h-px bg-border mt-5" />
      </header>

      <main>
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          }}
        >
          {HABITS.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              enabled={habitStates[habit.id].enabled}
              interval={habitStates[habit.id].interval}
              onToggle={handleToggle}
              onIntervalChange={handleIntervalChange}
            />
          ))}
        </div>
      </main>

      <footer className="mt-10 text-center">
        <p className="font-mono text-xs text-border-muted">
          Los hábitos pequeños hacen la diferencia
        </p>
      </footer>
    </div>
  );
}
