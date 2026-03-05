import { Module } from "@/data/studySystem";
import styles from "./ModuleCommon.module.css";

type Props = {
  module: Module;
};

export function StudyResources({ module }: Props) {
  return (
    <section className={styles.lessonPack}>
      <h3 className={styles.sectionTitle}>Start Here · Required Resources</h3>

      <div className={styles.resourceGrid}>
        <article className={styles.resourceCard}>
          <h4>Books & Reading Plan</h4>
          <ul className={styles.resourceList}>
            {module.requiredReading.map((reading) => (
              <li key={`${reading.title}-${reading.chapters}-${reading.pages}`}>
                <a href={reading.link} target="_blank" rel="noreferrer">
                  {reading.title}
                </a>
                <div>
                  Chapters: {reading.chapters} · Pages: {reading.pages}
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.resourceCard}>
          <h4>Bible Verses (Full Text Links)</h4>
          <ul className={styles.resourceList}>
            {module.scriptureLinks.map((verse) => (
              <li key={verse.reference}>
                <a href={verse.link} target="_blank" rel="noreferrer">
                  {verse.reference}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className={styles.teacherWrap}>
        <h4>Module Teacher · Guided Lesson</h4>
        {module.teacherLessons.map((lesson) => (
          <section key={lesson.title} className={styles.teacherLesson}>
            <h5>{lesson.title}</h5>
            <p>{lesson.content}</p>
          </section>
        ))}
      </article>
    </section>
  );
}