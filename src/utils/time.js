export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function buildInitialState(habits) {
  return Object.fromEntries(
    habits.map((h) => [
      h.id,
      {
        enabled: h.defaultEnabled,
        interval: h.defaultInterval,
        remaining: h.defaultInterval * 60,
        completedToday: 0,
      },
    ])
  );
}
