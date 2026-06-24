import { HABITS } from './data/habits';
import HabitCard from './components/HabitCard';

export default function App() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          Desk Reset
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {HABITS.filter((h) => h.defaultEnabled).length} hábitos activos
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
            <HabitCard key={habit.id} habit={habit} />
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
