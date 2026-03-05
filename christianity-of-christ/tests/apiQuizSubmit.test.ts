import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/quiz/submit/route";

describe("/api/quiz/submit", () => {
  it("returns score payload", async () => {
    const request = new Request("http://localhost/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: "module-0-quiz-1", answers: [1, 2, 2, 2, 1, 0, -1] }),
    });

    const response = await POST(request as never);
    const payload = (await response.json()) as { score: number };
    expect(typeof payload.score).toBe("number");
  });
});
