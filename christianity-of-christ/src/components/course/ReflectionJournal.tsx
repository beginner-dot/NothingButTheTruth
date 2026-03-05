"use client";

import { useEffect, useMemo, useState } from "react";

type Reflection = {
  id: string;
  lessonId: string;
  text: string;
  mood?: "encouraged" | "struggling" | "neutral";
  createdAt: string;
};

export function ReflectionJournal() {
  const [items, setItems] = useState<Reflection[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/reflection")
      .then((response) => response.json())
      .then((payload) => setItems(payload.reflections ?? []));
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => item.text.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  const exportData = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reflections.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Reflection Journal</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reflections"
          className="min-w-56 rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button onClick={exportData} className="rounded bg-slate-100 px-3 py-2 text-xs font-semibold">Export</button>
        <button className="rounded bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700">Delete (stub)</button>
      </div>
      <div className="mt-3 space-y-2">
        {filtered.map((item) => (
          <article key={item.id} className="rounded border border-slate-200 p-3 text-sm">
            <p>{item.text}</p>
            <p className="mt-1 text-xs text-slate-500">{item.lessonId} · {item.mood ?? "neutral"}</p>
          </article>
        ))}
        {!filtered.length && <p className="text-sm text-slate-500">No reflections found.</p>}
      </div>
    </section>
  );
}
