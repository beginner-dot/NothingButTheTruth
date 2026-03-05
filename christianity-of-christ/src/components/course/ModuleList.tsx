import Link from "next/link";
import { Module } from "@/lib/types";

export function ModuleList({ modules }: { modules: Module[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((module) => (
        <article key={module.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{module.id}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{module.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{module.shortDescription}</p>
          <p className="mt-2 text-xs text-slate-500">{module.estimatedMinutes} min · {module.framework}</p>
          <Link href={`/course/${module.id}`} className="mt-4 inline-flex text-sm font-semibold text-indigo-700">
            Start module →
          </Link>
        </article>
      ))}
    </div>
  );
}
