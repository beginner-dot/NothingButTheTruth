import Link from "next/link";

type Props = {
  moduleId: string;
  lessonSlug: string;
  title: string;
  description: string;
};

export function LessonCard({ moduleId, lessonSlug, title, description }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Link
        className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        href={`/course/${moduleId}/${lessonSlug}`}
      >
        Open lesson
      </Link>
    </article>
  );
}
