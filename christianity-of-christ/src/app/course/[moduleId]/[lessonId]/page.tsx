import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonContent } from "@/components/course/LessonContent";
import { QuizPlayer } from "@/components/course/QuizPlayer";
import { getLesson } from "@/lib/content";
import { quizzes } from "@/data/courseSeed";

type Params = {
  params: Promise<{ moduleId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: Params) {
  const { moduleId, lessonId } = await params;
  const lesson = getLesson(moduleId, lessonId);

  if (!lesson) {
    notFound();
  }

  const quiz = quizzes.find((item) => item.lessonId === lesson.frontmatter.id);

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm font-medium">← Back to course</Link>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="font-serif text-3xl font-bold">{lesson.frontmatter.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{lesson.frontmatter.moduleId} · {lesson.frontmatter.estimatedMinutes ?? 30} min</p>
      </section>
      <LessonContent content={lesson.content} />
      {quiz && <QuizPlayer quiz={quiz} />}
    </div>
  );
}
