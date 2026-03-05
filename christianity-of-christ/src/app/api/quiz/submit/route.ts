import { NextRequest, NextResponse } from "next/server";
import { quizzes } from "@/data/courseSeed";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { quizId: string; answers: number[] };
  const quiz = quizzes.find((item) => item.id === payload.quizId);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  let correct = 0;
  quiz.questions.forEach((question, index) => {
    if (typeof question.correctIndex === "number" && payload.answers[index] === question.correctIndex) {
      correct += 1;
    }
  });

  const score = Math.round((correct / quiz.questions.length) * 100);
  return NextResponse.json({ score, passed: score >= 70 });
}
