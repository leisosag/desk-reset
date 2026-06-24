import { useState, useEffect, useRef } from "react";
import { HABITS } from "./data/habits";
import { buildInitialState } from "./utils/time";
import HabitCard from "./components/HabitCard";

export default function App() {
  const [habitStates, setHabitStates] = useState(() => buildInitialState(HABITS));
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setHabitStates((prev) => {
        const next = { ...prev };
        HABITS.forEach((h) => {
          const s = prev[h.id];
          if (!s.enabled || s.remaining === 0) return;
          next[h.id] = { ...s, remaining: s.remaining - 1 };
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(tickRef.current);
  }, []);

  const handleToggle = (id) => {
    setHabitStates((prev) => {
      const s = prev[id];
      return {
        ...prev,
        [id]: {
          ...s,
          enabled: !s.enabled,
          remaining: s.interval * 60,
        },
      };
    });
  };

  const handleIntervalChange = (id, minutes) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], interval: minutes, remaining: minutes * 60 },
    }));
  };

  const enabledCount = Object.values(habitStates).filter((s) => s.enabled).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-16">

      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Desk Reset
        </h1>
        <p className="text-text-muted text-xs mt-1">
          {enabledCount} activo{enabledCount !== 1 ? "s" : ""}
        </p>
        <div className="h-px bg-border mt-5" />
      </header>

      <main>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
        >
          {HABITS.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              state={habitStates[habit.id]}
              onToggle={handleToggle}
              onIntervalChange={handleIntervalChange}
            />
          ))}
        </div>
      </main>

      <footer className="mt-10 text-center">
        <p className="font-mono text-xs text-border-muted">
          los hábitos pequeños hacen la diferencia
        </p>
      </footer>
    </div>
  );
}
