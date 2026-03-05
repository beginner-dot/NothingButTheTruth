import { Module } from "@/data/studySystem";
import styles from "./SourceIndexPanel.module.css";

type Props = {
  modules: Module[];
  onJump: (moduleId: number) => void;
};

export function SourceIndexPanel({ modules, onJump }: Props) {
  return (
    <section className={styles.panel} aria-label="Source index by module">
      <h2 className={styles.title}>Source Index · Bible and historical references by lesson</h2>
      <div className={styles.list}>
        {modules.map((module) => (
          <article key={module.id} className={styles.item}>
            <button className={styles.moduleBtn} onClick={() => onJump(module.id)}>
              Module {module.id}: {module.title.replace(`Module ${module.id} · `, "")}
            </button>
            <div className={styles.citations}>
              {module.logs.map((log) => (
                <button
                  key={`${module.id}-${log.citation}`}
                  className={styles.citeBtn}
                  onClick={() => onJump(module.id)}
                  title={log.excerpt}
                >
                  {log.source}: {log.citation}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
