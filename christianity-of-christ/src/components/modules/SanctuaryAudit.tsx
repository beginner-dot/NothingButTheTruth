"use client";

import { Module } from "@/data/studySystem";
import { useState } from "react";
import styles from "./ModuleCommon.module.css";
import { StudyResources } from "./StudyResources";

type NodeId = "altar" | "laver" | "ark" | null;

const mapDetails: Record<Exclude<NodeId, null>, { title: string; content: string }> = {
  altar: {
    title: "Altar · Sacrifice and Confession",
    content:
      "The sinner confessed and the sacrifice died in their place, showing that sin brings death and that forgiveness comes through a substitute (Leviticus 4).",
  },
  laver: {
    title: "Laver · Cleansing",
    content:
      "The laver represents cleansing and a changed life. Forgiveness is not only pardon; it also leads to a new walk with God.",
  },
  ark: {
    title: "Ark · God’s Law and Mercy",
    content:
      "Inside the ark was God’s law, and above it was the mercy seat. This shows that God’s judgment is based on truth, but offered with mercy through Christ.",
  },
};

type Props = { module: Module };

export function SanctuaryAudit({ module }: Props) {
  const [selected, setSelected] = useState<NodeId>(null);

  return (
    <section>
      <h2 className={styles.h2}>{module.title}</h2>
      <p className={styles.narrative}>{module.narrative}</p>
      <StudyResources module={module} />

      <div className={styles.map}>
        <button className={`${styles.pin} ${styles.pinAltar}`} onClick={() => setSelected("altar")}>
          Altar
        </button>
        <button className={`${styles.pin} ${styles.pinLaver}`} onClick={() => setSelected("laver")}>
          Laver
        </button>
        <button className={`${styles.pin} ${styles.pinArk}`} onClick={() => setSelected("ark")}>
          Ark
        </button>
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

      {selected && (
        <div className={styles.modalBackdrop} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <h3>{mapDetails[selected].title}</h3>
            <p className={styles.mt8}>{mapDetails[selected].content}</p>
            <button className={styles.cta} onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
