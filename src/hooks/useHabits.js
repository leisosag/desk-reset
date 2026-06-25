import { useState, useEffect, useRef } from 'react';
import { HABITS } from '../data/habits';
import { buildInitialState } from '../utils/time';

const SNOOZE_MINUTES = 5;
const DND_DURATION_MS = 60 * 60 * 1000; // 1 hora

export function useHabits() {
  const [habitStates, setHabitStates] = useState(() => {
    try {
      const saved = localStorage.getItem('deskreset-habits');
      if (saved) {
        const { states, date } = JSON.parse(saved);
        const today = new Date().toDateString();
        if (date === today) return states;
        return Object.fromEntries(
          Object.entries(states).map(([id, s]) => [
            id,
            { ...s, completedToday: 0, remaining: s.interval * 60 },
          ]),
        );
      }
    } catch {}
    return buildInitialState(HABITS);
  });
  const [notifications, setNotifications] = useState([]);
  const [dndManual, setDndManual] = useState(false);
  const [dndSchedule, setDndSchedule] = useState(false);
  const [activeHours, setActiveHours] = useState(() => {
    try {
      const saved = localStorage.getItem('deskreset-hours');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { start: '09:00', end: '18:00' };
  });
  const tickRef = useRef(null);
  const notifiedRef = useRef(new Set());

  const isDnd = dndManual || dndSchedule;

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

  function isWithinActiveHours(start, end) {
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return current >= sh * 60 + sm && current < eh * 60 + em;
  }

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setHabitStates((prev) => {
        const next = { ...prev };
        const inHours = isWithinActiveHours(activeHours.start, activeHours.end);
        setDndSchedule(!inHours);
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

  useEffect(() => {
    try {
      localStorage.setItem(
        'deskreset-habits',
        JSON.stringify({
          states: habitStates,
          date: new Date().toDateString(),
        }),
      );
    } catch {}
  }, [habitStates]);

  useEffect(() => {
    try {
      localStorage.setItem('deskreset-hours', JSON.stringify(activeHours));
    } catch {}
  }, [activeHours]);

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

  const toggleDnd = () => setDndManual((prev) => !prev);

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
    activeHours,
    setActiveHours,
    isActiveHours: isWithinActiveHours(activeHours.start, activeHours.end),
  };
}
