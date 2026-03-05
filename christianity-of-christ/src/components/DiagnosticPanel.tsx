"use client";

import { DiagnosticQuestion } from "@/data/studySystem";
import { useState } from "react";
import styles from "./modules/ModuleCommon.module.css";

type Props = {
  moduleId: number;
  questions: DiagnosticQuestion[];
  onSubmit: (answers: number[]) => boolean;
  alreadyPassed: boolean;
};

export function DiagnosticPanel({ moduleId, questions, onSubmit, alreadyPassed }: Props) {
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [result, setResult] = useState<"idle" | "pass" | "fail">("idle");

  const updateAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[questionIndex] = optionIndex;
      return copy;
    });
  };

  const handleSubmit = () => {
    const ready = answers.every((answer) => answer >= 0);
    if (!ready) {
      setResult("fail");
      return;
    }

    const passed = onSubmit(answers);
    setResult(passed ? "pass" : "fail");
  };

  return (
    <section className={styles.diagWrap}>
      <h3>Lesson Check · Module {moduleId}</h3>

      {alreadyPassed && <p className={styles.result}>✅ You already passed this lesson check.</p>}

      {questions.map((question, questionIndex) => (
        <article className={styles.question} key={question.id}>
          <strong>{question.prompt}</strong>
          <div>
            {question.options.map((option, optionIndex) => (
              <label className={styles.option} key={option}>
                <input
                  type="radio"
                  name={question.id}
                  checked={answers[questionIndex] === optionIndex}
                  onChange={() => updateAnswer(questionIndex, optionIndex)}
                />{" "}
                {option}
              </label>
            ))}
          </div>
        </article>
      ))}

      <button className={styles.cta} onClick={handleSubmit}>
        Submit Answers
      </button>

      {result === "pass" && <p className={styles.result}>✅ Great work. The next module is now unlocked.</p>}
      {result === "fail" && <p className={styles.result}>❌ Not quite yet. Review the lesson and try again.</p>}
    </section>
  );
}
