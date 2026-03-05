import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Module } from "@/lib/types";
import { modules } from "@/data/courseSeed";

const contentRoot = path.join(process.cwd(), "content", "modules");

type LessonFrontmatter = {
  id: string;
  title: string;
  moduleId: string;
  objectives?: string[];
  estimatedMinutes?: number;
  scripturePassages?: string[];
  egwExcerpts?: Array<{ title: string; url: string }>;
  historicalNotes?: string;
};

export type LoadedLesson = {
  frontmatter: LessonFrontmatter;
  content: string;
  slug: string;
};

export function getAllModuleMeta(): Module[] {
  return [...modules].sort((a, b) => a.order - b.order);
}

export function getLessonsForModule(moduleId: string): LoadedLesson[] {
  const moduleDir = path.join(contentRoot, moduleId);
  if (!fs.existsSync(moduleDir)) return [];

  return fs
    .readdirSync(moduleDir)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const fullPath = path.join(moduleDir, fileName);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(raw);
      return {
        frontmatter: parsed.data as LessonFrontmatter,
        content: parsed.content,
        slug: fileName.replace(/\.mdx$/, ""),
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getLesson(moduleId: string, slug: string): LoadedLesson | null {
  const fullPath = path.join(contentRoot, moduleId, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(raw);

  return {
    frontmatter: parsed.data as LessonFrontmatter,
    content: parsed.content,
    slug,
  };
}
