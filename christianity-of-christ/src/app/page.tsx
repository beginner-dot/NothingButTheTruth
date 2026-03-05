import { ModuleList } from "@/components/course/ModuleList";
import { course } from "@/data/courseSeed";
import { getAllModuleMeta } from "@/lib/content";

export default function HomePage() {
  const allModules = getAllModuleMeta();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Complete Interactive Course</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-700">{course.description}</p>
        <div className="mt-4 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-900">
          <strong>Theological Guardrail:</strong> Salvation is by grace through faith in Christ. Christlike obedience,
          habits, and service are the fruit of Holy Spirit transformation, never a way to earn acceptance.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-slate-900">Modules 0-10</h2>
        <ModuleList modules={allModules} />
      </section>
    </div>
  );
}
