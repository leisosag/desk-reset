import { HABITS } from './data/habits';
import { useHabits } from './hooks/useHabits';
import HabitCard from './components/HabitCard';
import NotificationBanner from './components/NotificationBanner';
import TimeSelect from './components/TimeSelect';
import SummaryModal from './components/SummaryModal';
import { Bell, BellOff, Heart } from 'lucide-react';

export default function App() {
  const {
    habitStates,
    notifications,
    isDnd,
    enabledCount,
    totalCompleted,
    toggle,
    setInterval,
    markDone,
    snooze,
    dismiss,
    toggleDnd,
    activeHours,
    setActiveHours,
    isActiveHours,
    showSummary,
    closeSummary,
  } = useHabits();

  const BellIcon = isDnd ? Bell : BellOff;

  return (
    <>
      <NotificationBanner
        notifications={notifications}
        onDismiss={dismiss}
        onSnooze={snooze}
        onDone={markDone}
      />

      <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                Desk Reset
              </h1>
              <p className="text-text-muted text-xs mt-1">
                {enabledCount} activo{enabledCount !== 1 ? 's' : ''} ·{' '}
                {totalCompleted} completado{totalCompleted !== 1 ? 's' : ''} hoy
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 border border-border-muted rounded-lg px-3 py-2">
                <TimeSelect
                  value={activeHours.start}
                  onChange={(val) =>
                    setActiveHours((prev) => ({ ...prev, start: val }))
                  }
                />
                <span className="text-border-muted text-xs">—</span>
                <TimeSelect
                  value={activeHours.end}
                  onChange={(val) =>
                    setActiveHours((prev) => ({ ...prev, end: val }))
                  }
                />
              </div>
              <button
                onClick={toggleDnd}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs border cursor-pointer transition-all duration-200 ${
                  isDnd
                    ? 'border-teal bg-teal-bg text-teal'
                    : 'border-border-muted bg-transparent text-text-muted hover:border-gray-500 hover:text-text-secondary'
                }`}
              >
                <BellIcon className="size-3 text-primary" />
                {isDnd ? 'Reanudar' : 'No molestar'}
              </button>
            </div>
          </div>
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
                state={habitStates[habit.id]}
                onToggle={toggle}
                onIntervalChange={setInterval}
                onDone={markDone}
                onSnooze={snooze}
                isActiveHours={isActiveHours}
                activeHours={activeHours}
              />
            ))}
          </div>
        </main>

        <footer className="mt-20 text-center">
          <p className="font-mono text-xs text-border-muted">
            Los hábitos pequeños hacen la diferencia
          </p>
          <p className="text-xs text-border-muted mt-3 flex items-center justify-center gap-1">
            Made with <Heart className="size-3 text-teal fill-teal" /> by Lei
          </p>
        </footer>
      </div>

      {showSummary && (
        <SummaryModal habitStates={habitStates} onClose={closeSummary} />
      )}
    </>
  );
}
