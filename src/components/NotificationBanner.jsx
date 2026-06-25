const SNOOZE_MINUTES = 5;

export default function NotificationBanner({
  notifications,
  onDismiss,
  onSnooze,
  onDone,
}) {
  if (notifications.length === 0) return null;
  const n = notifications[0];
  const HabitIcon = n.icon;

  return (
    <div
      className="fixed top-5 right-5 z-50 bg-surface border border-teal rounded-xl p-4 min-w-[280px] max-w-[340px] shadow-[0_8px_32px_rgba(45,212,191,0.15)] animate-slide-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <HabitIcon className="size-5 text-primary" />
        <div className="flex-1">
          <div className="text-teal font-semibold text-sm mb-0.5">{n.name}</div>
          <div className="text-text-secondary text-xs">{n.description}</div>
        </div>
        <button
          onClick={() => onDismiss(n.id)}
          aria-label="Cerrar notificación"
          className="btn-close cursor-pointer text-text-muted"
        >
          ×
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => onDone(n.id)} className="btn-primary">
          ✓ Listo
        </button>
        <button
          onClick={() => onSnooze(n.id)}
          className="btn-secondary text-text-secondary"
        >
          +{SNOOZE_MINUTES} min
        </button>
      </div>

      {notifications.length > 1 && (
        <div className="mt-2 text-xs text-text-muted text-center">
          +{notifications.length - 1} recordatorio
          {notifications.length > 2 ? 's' : ''} más
        </div>
      )}
    </div>
  );
}
