"use client";

import { useEffect, useState } from "react";
import { studySystem } from "@/data/studySystem";

const STORAGE_KEY = "coc-system-progress-v1";

type ProgressState = {
  passed: Record<number, boolean>;
};

const initialProgress: ProgressState = {
  passed: {},
};

export function useFileSystem() {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState;
        setProgress({
          passed: parsed?.passed ?? {},
        });
      }
    } catch {
      setProgress(initialProgress);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, loaded]);

  const isUnlocked = (moduleId: number) => {
    if (moduleId === 1) return true;
    return Boolean(progress.passed[moduleId - 1]);
  };

  let highestUnlocked = 1;
  for (const moduleItem of studySystem) {
    if (isUnlocked(moduleItem.id)) {
      highestUnlocked = moduleItem.id;
    }
  }

  const submitDiagnostic = (moduleId: number, answers: number[]) => {
    const moduleItem = studySystem.find((item) => item.id === moduleId);
    if (!moduleItem) return false;

    const isPass = moduleItem.diagnostic.every((question, index) => {
      return answers[index] === question.answer;
    });

    if (isPass) {
      setProgress((prev) => ({
        ...prev,
        passed: {
          ...prev.passed,
          [moduleId]: true,
        },
      }));
    }

    return isPass;
  };

  const resetAll = () => {
    setProgress(initialProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    loaded,
    progress,
    highestUnlocked,
    isUnlocked,
    submitDiagnostic,
    resetAll,
  };
}
