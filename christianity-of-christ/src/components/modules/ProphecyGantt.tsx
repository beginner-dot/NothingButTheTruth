"use client";

import { Module } from "@/data/studySystem";
import { useState } from "react";
import styles from "./ModuleCommon.module.css";
import { StudyResources } from "./StudyResources";

type Milestone = {
  year: string;
  label: string;
  execution: string;
};

const milestones: Milestone[] = [
  {
    year: "457 BC",
    label: "Decree to restore Jerusalem",
    execution: "This begins the prophetic timeline in Daniel 9 (see Ezra 7).",
  },
  {
    year: "27 AD",
    label: "Messiah appears",
    execution: "After 69 prophetic weeks, the timeline points to Christ’s ministry beginning.",
  },
  {
    year: "31 AD",
    label: "Christ’s sacrifice",
    execution: "In the middle of the final week, Christ dies, fulfilling the sacrificial system.",
  },
  {
    year: "34 AD",
    label: "End of the 70 weeks",
    execution: "The special prophetic period closes and the gospel mission expands broadly.",
  },
];

type Props = { module: Module };

export function ProphecyGantt({ module }: Props) {
  const [selected, setSelected] = useState<Milestone>(milestones[0]);

  return (
    <section>
      <h2 className={styles.h2}>{module.title}</h2>
      <p className={styles.narrative}>{module.narrative}</p>
      <StudyResources module={module} />

      <div className={styles.techBlock}>
        Prophecy Timeline · 457 BC → 34 AD · Click each date to read what it means
      </div>

      <div className={`${styles.timeline} ${styles.mt12}`}>
        {milestones.map((node) => (
          <button
            key={node.year}
            className={`${styles.timeNode} ${selected.year === node.year ? styles.selected : ""}`}
            onClick={() => setSelected(node)}
          >
            <strong>{node.year}</strong>
            <div>{node.label}</div>
          </button>
        ))}
      </div>

      <article className={`${styles.logCard} ${styles.mt12}`}>
        <h4>Timeline Notes · {selected.year}</h4>
        <p>{selected.execution}</p>
      </article>

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
