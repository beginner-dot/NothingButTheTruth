"use client";

type Status = "kept" | "struggled" | "prayed";

export function HabitItem({
  habitId,
  onSelect,
}: {
  habitId: string;
  onSelect: (status: Status) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <h4 className="font-medium capitalize text-slate-900">{habitId}</h4>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onSelect("kept")} className="rounded bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Kept</button>
        <button onClick={() => onSelect("struggled")} className="rounded bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Struggled</button>
        <button onClick={() => onSelect("prayed")} className="rounded bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Need Prayer</button>
      </div>
    </div>
  );
}
