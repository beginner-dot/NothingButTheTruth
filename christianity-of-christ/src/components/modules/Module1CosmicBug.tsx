import { Module } from "@/data/studySystem";
import styles from "./ModuleCommon.module.css";
import { StudyResources } from "./StudyResources";

type Props = { module: Module };

export function Module1CosmicBug({ module }: Props) {
  return (
    <section>
      <h2 className={styles.h2}>{module.title}</h2>
      <p className={styles.narrative}>{module.narrative}</p>
      <StudyResources module={module} />

      <div className={styles.techBlock}>
        Lesson Map · What happened and why it matters
        <br />
        [1] Lucifer created good → [2] Pride entered his heart → [3] Rebellion spread in heaven
        → [4] War in heaven → [5] Conflict moved to earth
      </div>

      <div className={styles.logGrid}>
        {module.logs.map((log) => (
          <article className={styles.logCard} key={log.citation}>
            <h4>
              {log.source} · {log.citation}
            </h4>
            <p>{log.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
