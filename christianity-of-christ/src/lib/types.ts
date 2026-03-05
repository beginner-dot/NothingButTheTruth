export interface Course {
  id: string;
  title: string;
  description: string;
  modules: string[];
  resources: ResourceLink[];
}

export interface Module {
  id: string;
  title: string;
  shortDescription: string;
  order: number;
  lessons: string[];
  framework: string;
  estimatedMinutes: number;
  badge?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  objectives: string[];
  scripturePassages: string[];
  egwExcerpts: ResourceLink[];
  historicalNotes: string;
  contentMd: string;
  reflectionPrompts: string[];
  practicalExercises: string[];
  quizId?: string;
  resources: ResourceLink[];
}

export interface ResourceLink {
  title: string;
  url: string;
  type: "Bible" | "EGW" | "History" | "Article" | "Audio" | "PDF";
  publicDomain: boolean;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "scenario" | "short-answer";
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface UserProgress {
  userId: string;
  moduleProgress: {
    [moduleId: string]: {
      completedLessons: string[];
      habits: { [habitId: string]: "kept" | "struggled" | "prayed" };
      reflections: Reflection[];
    };
  };
  badges: string[];
  lastActive: string;
}

export interface Reflection {
  id: string;
  lessonId: string;
  text: string;
  mood?: "encouraged" | "struggling" | "neutral";
  createdAt: string;
}

export interface HabitEntry {
  habitId: string;
  status: "kept" | "struggled" | "prayed";
  createdAt: string;
}

export interface StruggleProfile {
  habitId: string;
  score: number;
}
