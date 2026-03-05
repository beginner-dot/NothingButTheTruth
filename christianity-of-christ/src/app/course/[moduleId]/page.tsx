import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCard } from "@/components/course/LessonCard";
import { getLessonsForModule } from "@/lib/content";
import { modules } from "@/data/courseSeed";

type Params = {
  params: Promise<{ moduleId: string }>;
};

export default async function ModulePage({ params }: Params) {
  const { moduleId } = await params;
  const module = modules.find((item) => item.id === moduleId);
  if (!module) notFound();

  const lessons = getLessonsForModule(moduleId);

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm font-medium">← Back to modules</Link>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="font-serif text-3xl font-bold">{module.title}</h1>
        <p className="mt-2 text-sm text-slate-700">{module.shortDescription}</p>
        <p className="mt-2 text-xs text-slate-500">Framework: {module.framework}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.slug}
            moduleId={moduleId}
            lessonSlug={lesson.slug}
            title={lesson.frontmatter.title}
            description={lesson.frontmatter.historicalNotes ?? "Lesson content"}
          />
        ))}
      </div>
    </div>
  );
}
