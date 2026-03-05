import { Course, Module, Quiz, ResourceLink } from "@/lib/types";

export const sharedResources: ResourceLink[] = [
  {
    title: "Bible Gateway KJV",
    url: "https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/",
    type: "Bible",
    publicDomain: true,
  },
  {
    title: "Ellen G. White Writings",
    url: "https://egwwritings.org/",
    type: "EGW",
    publicDomain: true,
  },
  {
    title: "Adventist Pioneer Library (Public Domain)",
    url: "https://archive.org/",
    type: "History",
    publicDomain: true,
  },
];

export const modules: Module[] = [
  { id: "module-0", title: "Introduction to the Christianity of Christ", shortDescription: "Course vision, tone, and learning path.", order: 0, lessons: ["module-0-lesson-1", "module-0-deep-dive-1", "module-0-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 20, badge: "Getting Started" },
  { id: "module-1", title: "Christ as the First Christian", shortDescription: "Why Christ is the original model of Christian life.", order: 1, lessons: ["module-1-lesson-1", "module-1-deep-dive-1", "module-1-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 45, badge: "Christ-Centered Identity" },
  { id: "module-2", title: "Christ’s Prayer Life and Communion with the Father", shortDescription: "Prayer as dependence, alignment, and mission.", order: 2, lessons: ["module-2-lesson-1", "module-2-deep-dive-1", "module-2-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 40 },
  { id: "module-3", title: "Christ’s Relationship to Scripture", shortDescription: "Christ trusted, quoted, and lived the Word.", order: 3, lessons: ["module-3-lesson-1", "module-3-deep-dive-1", "module-3-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 40 },
  { id: "module-4", title: "Christ’s Sabbath and Worship Practice", shortDescription: "Worship shaped by love, truth, and rest in God.", order: 4, lessons: ["module-4-lesson-1", "module-4-deep-dive-1", "module-4-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 50 },
  { id: "module-5", title: "Christ’s Compassion and Service", shortDescription: "Practical mercy as the heartbeat of discipleship.", order: 5, lessons: ["module-5-lesson-1", "module-5-deep-dive-1", "module-5-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 40 },
  { id: "module-6", title: "Christ’s Teaching on Love and Law", shortDescription: "Grace-led obedience as fruit of transformation.", order: 6, lessons: ["module-6-lesson-1", "module-6-deep-dive-1", "module-6-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 45 },
  { id: "module-7", title: "Christ’s Habits of Solitude and Retreat", shortDescription: "Silence, withdrawal, and renewal for mission.", order: 7, lessons: ["module-7-lesson-1", "module-7-deep-dive-1", "module-7-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 35 },
  { id: "module-8", title: "Christ’s Model of Discipleship and Mentoring", shortDescription: "How Christ formed people over time.", order: 8, lessons: ["module-8-lesson-1", "module-8-deep-dive-1", "module-8-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 50 },
  { id: "module-9", title: "Christ’s Response to Suffering and Injustice", shortDescription: "Faithful endurance with truth and compassion.", order: 9, lessons: ["module-9-lesson-1", "module-9-deep-dive-1", "module-9-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 45 },
  { id: "module-10", title: "Living Christ’s Christianity Today", shortDescription: "Sustainable Christlike living in modern life.", order: 10, lessons: ["module-10-lesson-1", "module-10-deep-dive-1", "module-10-deep-dive-2"], framework: "Bible Foundation; Spirit of Prophecy; Historical Context; Practical Application; Accountability", estimatedMinutes: 60, badge: "Course Finisher" },
];

export const course: Course = {
  id: "christianity-of-christ-course",
  title: "The Christianity of Christ",
  description:
    "An interactive Christ-centered course focused on how Jesus lived, taught, and formed disciples, with practical Spirit-led application for daily life.",
  modules: modules.map((module) => module.id),
  resources: sharedResources,
};

const defaultQuizQuestions = [
  {
    id: "q1",
    type: "multiple-choice" as const,
    question: "Which statement best reflects salvation in this course?",
    options: [
      "We earn salvation through perfect habits",
      "Salvation is by grace through faith, and obedience is fruit",
      "Good works replace faith",
      "Sanctification makes Christ unnecessary",
    ],
    correctIndex: 1,
    explanation: "Ephesians 2:8-10 and Titus 2:11-14 present grace as the source and transformed living as fruit.",
  },
  {
    id: "q2",
    type: "multiple-choice" as const,
    question: "What is the main model for Christian life in this course?",
    options: ["Cultural trends", "Personal preference", "The life of Christ", "Historical ritual alone"],
    correctIndex: 2,
    explanation: "John 13:15 and 1 Peter 2:21 point to Christ as the model.",
  },
  {
    id: "q3",
    type: "multiple-choice" as const,
    question: "What role does the Holy Spirit have in discipleship?",
    options: ["None", "Only emotional comfort", "Transformation and empowerment", "Optional extra"],
    correctIndex: 2,
    explanation: "John 14:26 and Galatians 5:22-25 teach Spirit-led growth.",
  },
  {
    id: "q4",
    type: "scenario" as const,
    question: "You failed a spiritual habit this week. What response aligns with Christ-centered discipleship?",
    options: ["Quit trying", "Hide in shame", "Repent, receive grace, and continue with accountability", "Blame others"],
    correctIndex: 2,
    explanation: "1 John 1:9 and Hebrews 4:14-16 call believers to return confidently to Christ.",
  },
  {
    id: "q5",
    type: "scenario" as const,
    question: "A friend is spiritually discouraged. What is the most Christlike support?",
    options: ["Harsh rebuke only", "Prayer, truth, listening, and practical help", "Ignore them", "Condemn them publicly"],
    correctIndex: 1,
    explanation: "Galatians 6:1-2 and John 13:34-35 emphasize restorative love.",
  },
  {
    id: "q6",
    type: "true-false" as const,
    question: "Christlike obedience is the result of grace, not a method to purchase salvation.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "Romans 3:24 and Ephesians 2:10 hold justification and sanctification together.",
  },
  {
    id: "q7",
    type: "short-answer" as const,
    question: "In 2-3 sentences, describe one practical way you will follow Christ this week and why.",
    explanation: "Answers should name a concrete step, spiritual motive, and dependence on grace.",
  },
];

export const quizzes: Quiz[] = modules.map((module) => ({
  id: `${module.id}-quiz-1`,
  lessonId: `${module.id}-lesson-1`,
  questions: defaultQuizQuestions.map((question) => ({ ...question, id: `${module.id}-${question.id}` })),
}));

export const struggleToLessonMap: Record<string, string[]> = {
  prayer: ["module-2-lesson-1", "module-7-lesson-1"],
  scripture: ["module-3-lesson-1", "module-1-lesson-1"],
  service: ["module-5-lesson-1", "module-8-lesson-1"],
  solitude: ["module-7-lesson-1", "module-10-lesson-1"],
};
