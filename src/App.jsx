import { useState, useEffect, useRef } from "react";
import { HABITS } from "./data/habits";
import { buildInitialState } from "./utils/time";
import HabitCard from "./components/HabitCard";
import NotificationBanner from "./components/NotificationBanner";

const SNOOZE_MINUTES = 5;

export default function App() {
  const [habitStates, setHabitStates] = useState(() => buildInitialState(HABITS));
  const [notifications, setNotifications] = useState([]);
  const tickRef = useRef(null);
  const notifiedRef = useRef(new Set());

  // Pedir permiso para notificaciones nativas al montar
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const triggerNotification = (habit) => {
    // Banner en la app
    setNotifications((prev) => {
      if (prev.find((n) => n.id === habit.id)) return prev;
      return [...prev, { id: habit.id, name: habit.name, description: habit.description, icon: habit.icon }];
    });
    // Notificación nativa del browser
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(habit.name, { body: habit.description });
    }
  };

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setHabitStates((prev) => {
        const next = { ...prev };
        HABITS.forEach((h) => {
          const s = prev[h.id];
          if (!s.enabled) return;
          if (s.remaining > 0) {
            next[h.id] = { ...s, remaining: s.remaining - 1 };
            notifiedRef.current.delete(h.id);
          } else {
            if (!notifiedRef.current.has(h.id)) {
              notifiedRef.current.add(h.id);
              triggerNotification(h);
            }
          }
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
        [id]: { ...s, enabled: !s.enabled, remaining: s.interval * 60, snoozed: false },
      };
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const handleIntervalChange = (id, minutes) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], interval: minutes, remaining: minutes * 60, snoozed: false },
    }));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const handleDone = (id) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], remaining: prev[id].interval * 60, snoozed: false },
    }));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const handleSnooze = (id) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], remaining: SNOOZE_MINUTES * 60, snoozed: true },
    }));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const enabledCount = Object.values(habitStates).filter((s) => s.enabled).length;

  return (
    <>
      <NotificationBanner
        notifications={notifications}
        onDismiss={handleDismiss}
        onSnooze={handleSnooze}
        onDone={handleDone}
      />

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
                onDone={handleDone}
                onSnooze={handleSnooze}
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
    </>
  );
}
