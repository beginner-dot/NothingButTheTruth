type Props = { value: number };

export function ProgressRing({ value }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  const angle = (clamped / 100) * 360;

  return (
    <div
      className="grid h-28 w-28 place-items-center rounded-full border border-slate-300"
      style={{ background: `conic-gradient(#4f46e5 ${angle}deg, #e2e8f0 ${angle}deg)` }}
      aria-label={`Progress ${clamped}%`}
    >
      <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-sm font-bold text-slate-800">{clamped}%</div>
    </div>
  );
}
