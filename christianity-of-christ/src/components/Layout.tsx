import { Module } from "@/data/studySystem";
import styles from "./Layout.module.css";

type AppLayoutProps = {
  modules: Module[];
  activeModuleId: number;
  isUnlocked: (moduleId: number) => boolean;
  onSelect: (moduleId: number) => void;
  children: React.ReactNode;
};

export function Layout({
  modules,
  activeModuleId,
  isUnlocked,
  onSelect,
  children,
}: AppLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.headerCard}>
        <h1 className={styles.headerTitle}>
          The Christianity of Christ: A Systematic Reconstruction
        </h1>
        <p className={styles.headerSub}>
          Interactive Bible Study · Clear for all backgrounds · KJV + Spirit of Prophecy + Pioneer Sources
        </p>

        <div className={styles.navGrid}>
          {modules.map((module) => {
            const unlocked = isUnlocked(module.id);
            return (
              <button
                key={module.id}
                className={`${styles.navBtn} ${
                  activeModuleId === module.id ? styles.active : ""
                }`}
                onClick={() => onSelect(module.id)}
                disabled={!unlocked}
                title={unlocked ? "Open module" : "Locked until prior diagnostic passes"}
              >
                <strong>{module.id}. </strong>
                {module.title.replace("Module " + module.id + " · ", "")}
                {!unlocked && <div>🔒 Complete previous lesson quiz to unlock</div>}
              </button>
            );
          })}
        </div>
      </header>

      <main className={styles.card}>{children}</main>
    </div>
  );
}
