export default function TimeSelect({ value, onChange }) {
  const hours = Array.from(
    { length: 24 },
    (_, i) => String(i).padStart(2, '0') + ':00',
  );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent text-text-muted text-xs border-none outline-none cursor-pointer appearance-none"
    >
      {hours.map((h) => (
        <option key={h} value={h} className="bg-surface text-text-primary">
          {h}
        </option>
      ))}
    </select>
  );
}
