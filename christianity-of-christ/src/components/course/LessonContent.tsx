import { MDXRemote } from "next-mdx-remote/rsc";

export function LessonContent({ content }: { content: string }) {
  return (
    <div className="prose-block rounded-xl border border-slate-200 bg-white p-6">
      <MDXRemote source={content} />
    </div>
  );
}
