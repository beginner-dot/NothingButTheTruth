import { describe, expect, it } from "vitest";
import { computeHabitStruggleScore, recommendLessonsForStruggles, topStruggles } from "@/lib/realityCheck";

describe("realityCheck logic", () => {
  it("computes struggle scores", () => {
    const result = computeHabitStruggleScore([
      { habitId: "prayer", status: "struggled" },
      { habitId: "prayer", status: "prayed" },
      { habitId: "scripture", status: "kept" },
    ] as Array<{ habitId: string; status: "kept" | "struggled" | "prayed" }>);

    expect(result.prayer).toBe(3);
    expect(result.scripture).toBe(0);
  });

  it("returns top struggles and recommendations", () => {
    const struggles = topStruggles(
      [
        { habitId: "prayer", status: "struggled" },
        { habitId: "service", status: "struggled" },
        { habitId: "scripture", status: "prayed" },
      ],
      [{ id: "1", lessonId: "x", text: "Hard week", mood: "struggling", createdAt: new Date().toISOString() }],
    );

    expect(struggles.length).toBeGreaterThan(0);
    const recs = recommendLessonsForStruggles(struggles);
    expect(recs.length).toBeGreaterThan(0);
  });
});
