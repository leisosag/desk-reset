import { useState, useEffect, useRef } from 'react';
import { HABITS } from '../data/habits';
import { buildInitialState } from '../utils/time';

const SNOOZE_MINUTES = 5;
const DND_DURATION_MS = 60 * 60 * 1000; // 1 hora

export function useHabits() {
  const [habitStates, setHabitStates] = useState(() =>
    buildInitialState(HABITS),
  );
  const [notifications, setNotifications] = useState([]);
  const [dndUntil, setDndUntil] = useState(null);
  const tickRef = useRef(null);
  const notifiedRef = useRef(new Set());

  const isDnd = dndUntil !== null && Date.now() < dndUntil;

  const triggerNotification = (habit) => {
    if (isDnd) return;
    setNotifications((prev) => {
      if (prev.find((n) => n.id === habit.id)) return prev;
      return [
        ...prev,
        {
          id: habit.id,
          name: habit.name,
          description: habit.description,
          icon: habit.icon,
        },
      ];
    });
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(habit.name, { body: habit.description });
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
  }, [isDnd]);
  // isDnd como dependencia para que triggerNotification use el valor actualizado

  const toggle = (id) => {
    setHabitStates((prev) => {
      const s = prev[id];
      return {
        ...prev,
        [id]: {
          ...s,
          enabled: !s.enabled,
          remaining: s.interval * 60,
          snoozed: false,
        },
      };
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const setInterval_ = (id, minutes) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        interval: minutes,
        remaining: minutes * 60,
        snoozed: false,
      },
    }));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const markDone = (id) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        remaining: prev[id].interval * 60,
        snoozed: false,
        completedToday: prev[id].completedToday + 1,
      },
    }));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const snooze = (id) => {
    setHabitStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], remaining: SNOOZE_MINUTES * 60, snoozed: true },
    }));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notifiedRef.current.delete(id);
  };

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleDnd = () => {
    if (isDnd) {
      setDndUntil(null);
    } else {
      setDndUntil(Date.now() + DND_DURATION_MS);
      setNotifications([]);
    }
  };

  const enabledCount = Object.values(habitStates).filter(
    (s) => s.enabled,
  ).length;
  const totalCompleted = Object.values(habitStates).reduce(
    (acc, s) => acc + s.completedToday,
    0,
  );

  return {
    habitStates,
    notifications,
    isDnd,
    enabledCount,
    totalCompleted,
    toggle,
    setInterval: setInterval_,
    markDone,
    snooze,
    dismiss,
    toggleDnd,
  };
}
