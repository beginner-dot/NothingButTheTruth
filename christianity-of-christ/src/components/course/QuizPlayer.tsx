"use client";

import { useState } from "react";
import { Quiz } from "@/lib/types";

export function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<number[]>(Array.from({ length: quiz.questions.length }, () => -1));
  const [result, setResult] = useState<number | null>(null);

  const submit = async () => {
    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz.id, answers }),
    });
    const payload = (await response.json()) as { score: number };
    setResult(payload.score);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Quiz</h3>
      {quiz.questions.map((question, index) => (
        <article key={question.id} className="mt-4 rounded border border-slate-200 p-3">
          <p className="font-medium">{question.question}</p>
          {question.options?.map((option, optionIndex) => (
            <label key={option} className="mt-2 block text-sm">
              <input
                type="radio"
                className="mr-2"
                checked={answers[index] === optionIndex}
                onChange={() =>
                  setAnswers((previous) => {
                    const copy = [...previous];
                    copy[index] = optionIndex;
                    return copy;
                  })
                }
              />
              {option}
            </label>
          ))}
        </article>
      ))}
      <button onClick={submit} className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm text-white">Submit Quiz</button>
      {result !== null && <p className="mt-3 text-sm font-semibold">Score: {result}%</p>}
    </section>
  );
}
