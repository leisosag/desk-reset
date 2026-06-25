import { useState, useEffect, useRef } from 'react';
import { HABITS } from '../data/habits';
import { buildInitialState } from '../utils/time';

const SNOOZE_MINUTES = 5;

function isWithinActiveHours(start, end) {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return current >= sh * 60 + sm && current < eh * 60 + em;
}

export function useHabits() {
  const [habitStates, setHabitStates] = useState(() => {
    const base = buildInitialState(HABITS);
    try {
      const saved = localStorage.getItem('deskreset-habits');
      if (saved) {
        const { states, date } = JSON.parse(saved);
        const today = new Date().toDateString();
        const merged = { ...base, ...states };
        if (date === today) return merged;
        return Object.fromEntries(
          Object.entries(merged).map(([id, s]) => [
            id,
            { ...s, completedToday: 0, remaining: s.interval * 60 },
          ]),
        );
      }
    } catch {}
    return base;
  });
  const [notifications, setNotifications] = useState([]);
  const [dndManual, setDndManual] = useState(false);
  const [dndSchedule, setDndSchedule] = useState(() => {
    const saved = (() => {
      try {
        const s = localStorage.getItem('deskreset-hours');
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    })();
    const hours = saved ?? { start: '09:00', end: '18:00' };
    return !isWithinActiveHours(hours.start, hours.end);
  });
  const [activeHours, setActiveHours] = useState(() => {
    try {
      const saved = localStorage.getItem('deskreset-hours');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { start: '09:00', end: '18:00' };
  });
  const [showSummary, setShowSummary] = useState(false);

  const tickRef = useRef(null);
  const notifiedRef = useRef(new Set());
  const wasActiveRef = useRef(
    isWithinActiveHours(activeHours.start, activeHours.end),
  );
  const isDndRef = useRef(false);
  const activeHoursRef = useRef(activeHours);

  const isDnd = dndManual || dndSchedule;

  const [visibleHabits, setVisibleHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('deskreset-visible');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(HABITS.filter((h) => h.defaultEnabled).map((h) => h.id));
  });
  const visibleHabitsRef = useRef(visibleHabits);

  // Sincronizar refs con estado
  useEffect(() => {
    isDndRef.current = isDnd;
  }, [isDnd]);

  useEffect(() => {
    activeHoursRef.current = activeHours;
  }, [activeHours]);

  useEffect(() => {
    visibleHabitsRef.current = visibleHabits;
  }, [visibleHabits]);

  const triggerNotification = (habit) => {
    if (isDndRef.current) return;
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
      const inHours = isWithinActiveHours(
        activeHoursRef.current.start,
        activeHoursRef.current.end,
      );

      if (inHours && !wasActiveRef.current) {
        // entró al horario activo
        setDndManual(false);
        setDndSchedule(false);
      } else if (!inHours && wasActiveRef.current) {
        // salió del horario activo
        setDndSchedule(true);
        setShowSummary(true);
      }

      wasActiveRef.current = inHours;

      if (!inHours) return;

      setHabitStates((prev) => {
        const next = { ...prev };
        HABITS.forEach((h) => {
          const s = prev[h.id];
          if (!s.enabled || !visibleHabitsRef.current.has(h.id)) return;
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

  useEffect(() => {
    try {
      localStorage.setItem(
        'deskreset-visible',
        JSON.stringify([...visibleHabits]),
      );
    } catch {}
  }, [visibleHabits]);

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

  const enabledCount = HABITS.filter(
    (h) => visibleHabits.has(h.id) && habitStates[h.id]?.enabled,
  ).length;

  const totalCompleted = Object.values(habitStates).reduce(
    (acc, s) => acc + s.completedToday,
    0,
  );

  const toggleVisibility = (id) => {
    setVisibleHabits((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return {
    habitStates,
    notifications,
    isDnd,
    dndSchedule,
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
    showSummary,
    closeSummary: () => setShowSummary(false),
    visibleHabits,
    toggleVisibility,
  };
}
