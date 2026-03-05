"use client";

import { Module } from "@/data/studySystem";
import { useMemo, useState } from "react";
import styles from "./ModuleCommon.module.css";
import { StudyResources } from "./StudyResources";

type Stage = {
  year: number;
  label: string;
  details: string;
};

const stages: Stage[] = [
  {
    year: 34,
    label: "Apostolic Church",
    details: "The early church followed the teachings of Jesus and the apostles closely.",
  },
  {
    year: 325,
    label: "Growing Compromise",
    details: "Church and state became increasingly connected, and traditions began to replace Scripture in many places.",
  },
  {
    year: 538,
    label: "Long Apostasy Era",
    details: "Bible truth was often hidden from common people while human authority was elevated.",
  },
  {
    year: 1517,
    label: "Reformation",
    details: "Reformers called people back to the Bible and salvation by faith in Christ.",
  },
  {
    year: 1798,
    label: "Prophetic Turning Point",
    details: "Prophetic time markers highlighted a shift and opened the way for deeper Bible study.",
  },
  {
    year: 1844,
    label: "Restoration of Truth",
    details: "A renewed movement emphasized Scripture, the commandments of God, and the faith of Jesus.",
  },
];

type Props = { module: Module };

export function SystemRestoreSlider({ module }: Props) {
  const [year, setYear] = useState(34);

  const current = useMemo(() => {
    let selected = stages[0];
    for (const stage of stages) {
      if (year >= stage.year) {
        selected = stage;
      }
    }
    return selected;
  }, [year]);

  return (
    <section>
      <h2 className={styles.h2}>{module.title}</h2>
      <p className={styles.narrative}>{module.narrative}</p>
      <StudyResources module={module} />

      <div className={styles.sliderWrap}>
        <label htmlFor="restore-slider" className={styles.techBlock}>
          Move the timeline: {year} AD
        </label>
        <input
          id="restore-slider"
          className={styles.slider}
          type="range"
          min={34}
          max={1844}
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
        />
      </div>

      <article className={`${styles.logCard} ${styles.mt12}`}>
        <h4>
          {current.year} · {current.label}
        </h4>
        <p>{current.details}</p>
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
