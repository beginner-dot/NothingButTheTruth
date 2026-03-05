import { Module } from "@/data/studySystem";
import styles from "./ModuleCommon.module.css";
import { StudyResources } from "./StudyResources";

type Props = { module: Module };

export function CompatibilityTable({ module }: Props) {
  return (
    <section>
      <h2 className={styles.h2}>{module.title}</h2>
      <p className={styles.narrative}>{module.narrative}</p>
      <StudyResources module={module} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Comparison Point</th>
            <th>Moral Law (Ten Commandments)</th>
            <th>Ceremonial Law</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Author</td>
            <td>Written by God (Ex. 31:18)</td>
            <td>Written by Moses (Deut. 31:24)</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td>Inside the Ark</td>
            <td>In the side of the Ark</td>
          </tr>
          <tr>
            <td>Scope</td>
            <td>Universal moral principles</td>
            <td>Israel’s symbolic worship system</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>Permanent</td>
            <td>Temporary until cross fulfillment</td>
          </tr>
          <tr>
            <td>Function</td>
            <td>Shows what is right and wrong</td>
            <td>Pointed forward to Christ’s sacrifice</td>
          </tr>
        </tbody>
      </table>

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
