import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAdapter } from "@/lib/db";
import { recommendLessonsForStruggles, topStruggles } from "@/lib/realityCheck";

export async function GET() {
  const user = await getCurrentUser();
  const adapter = getAdapter();

  const [habits, reflections, progress] = await Promise.all([
    adapter.listHabitEntries(user.id),
    adapter.listReflections(user.id),
    adapter.getProgress(user.id),
  ]);

  const struggles = topStruggles(habits, reflections);
  const recommendations = recommendLessonsForStruggles(struggles);

  return NextResponse.json({
    user,
    progress,
    struggles,
    recommendations,
    encouragement: {
      bible: "Philippians 1:6",
      quote: "Christ is waiting with longing desire for the manifestation of Himself in His church. — Christ’s Object Lessons",
    },
  });
}
