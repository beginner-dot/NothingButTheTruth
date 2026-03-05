"use client";

import { useState } from "react";

export function ReflectionEditor({ lessonId }: { lessonId: string }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState<"encouraged" | "struggling" | "neutral">("neutral");
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        lessonId,
        text,
        mood,
        createdAt: new Date().toISOString(),
      }),
    });
    setSaved(true);
    setText("");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Reflection Journal</h3>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Write your reflection..."
        className="mt-3 min-h-28 w-full rounded border border-slate-300 p-2"
      />
      <div className="mt-2 flex gap-2">
        <button onClick={() => setMood("encouraged")} className="rounded bg-emerald-100 px-3 py-1 text-xs">Encouraged</button>
        <button onClick={() => setMood("struggling")} className="rounded bg-amber-100 px-3 py-1 text-xs">Struggling</button>
        <button onClick={() => setMood("neutral")} className="rounded bg-slate-100 px-3 py-1 text-xs">Neutral</button>
      </div>
      <button onClick={save} className="mt-3 rounded bg-slate-900 px-4 py-2 text-sm text-white">Save Reflection</button>
      {saved && <p className="mt-2 text-sm text-emerald-700">Saved.</p>}
    </section>
  );
}
