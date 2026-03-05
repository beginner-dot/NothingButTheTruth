import { Reflection } from "@/lib/types";
import { struggleToLessonMap } from "@/data/courseSeed";

export type HabitStatus = "kept" | "struggled" | "prayed";

export type HabitRecord = {
  habitId: string;
  status: HabitStatus;
};

export function computeHabitStruggleScore(records: HabitRecord[]): Record<string, number> {
  return records.reduce<Record<string, number>>((accumulator, record) => {
    const delta = record.status === "struggled" ? 2 : record.status === "prayed" ? 1 : -1;
    accumulator[record.habitId] = Math.max(0, (accumulator[record.habitId] ?? 0) + delta);
    return accumulator;
  }, {});
}

export function reflectionSentimentWeight(reflections: Reflection[]): number {
  return reflections.reduce((score, reflection) => {
    if (reflection.mood === "struggling") return score + 1;
    if (reflection.mood === "encouraged") return score - 0.5;
    return score;
  }, 0);
}

export function topStruggles(records: HabitRecord[], reflections: Reflection[]): string[] {
  const scores = computeHabitStruggleScore(records);
  const sentimentAdjustment = reflectionSentimentWeight(reflections);

  return Object.entries(scores)
    .map(([habitId, score]) => ({ habitId, score: score + sentimentAdjustment }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.habitId);
}

export function recommendLessonsForStruggles(struggles: string[]): string[] {
  return Array.from(
    new Set(struggles.flatMap((habit) => struggleToLessonMap[habit] ?? ["module-10-lesson-1"])),
  ).slice(0, 6);
}
