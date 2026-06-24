export default function CircularProgress({ progress, color = "#2dd4bf" }) {
  const size = 72;
  const stroke = 3;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)" }}
      aria-hidden="true"
    >
      <circle cx={36} cy={36} r={r} fill="none" stroke="#252836" strokeWidth={stroke} />
      <circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}
