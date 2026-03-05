"use client";

import { useEffect, useMemo, useState } from "react";
import { HabitItem } from "@/components/course/HabitItem";
import { ProgressRing } from "@/components/course/ProgressRing";
import { RealityCheckCard } from "@/components/course/RealityCheckCard";
import { ReflectionEditor } from "@/components/course/ReflectionEditor";
import { ReflectionJournal } from "@/components/course/ReflectionJournal";

type DashboardPayload = {
  struggles: string[];
  recommendations: string[];
  encouragement: { bible: string; quote: string };
};

const habits = ["prayer", "scripture", "service", "solitude"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [entries, setEntries] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((payload) => setData(payload));
  }, []);

  const completePercent = useMemo(() => Math.min(100, entries * 5), [entries]);

  const postHabit = async (habitId: string, status: "kept" | "struggled" | "prayed") => {
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, status, createdAt: new Date().toISOString() }),
    });
    setEntries((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold">Dashboard & Reality Check</h1>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Progress Summary</h2>
          <div className="mt-4 grid place-items-center">
            <ProgressRing value={completePercent} />
          </div>
          <p className="mt-3 text-sm text-slate-600">Streak/notifications: weekly summary stub active in UI.</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold">Spiritual Habits Tracker</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {habits.map((habit) => (
              <HabitItem key={habit} habitId={habit} onSelect={(status) => postHabit(habit, status)} />
            ))}
          </div>
        </section>
      </div>

      {data && <RealityCheckCard struggles={data.struggles} recommendations={data.recommendations} />}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Encouragement Feed</h2>
        <p className="mt-2 text-sm text-slate-700">{data?.encouragement.bible ?? "Philippians 1:6"}</p>
        <p className="mt-1 text-sm italic text-slate-600">{data?.encouragement.quote}</p>
      </section>

      <ReflectionEditor lessonId="dashboard-weekly" />
      <ReflectionJournal />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Data Controls</h2>
        <p className="mt-2 text-sm text-slate-700">Export/delete controls are available as API-ready stubs and can be wired to auth roles.</p>
      </section>
    </div>
  );
}
