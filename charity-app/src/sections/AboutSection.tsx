import React from 'react'
import styles from './aboutSection.module.css'

export default function AboutSection() {
  return (
    <section className={styles.section} aria-label="About us">
      <div className={styles.grid}>
        <div className={styles.left}>
          <h2 className={styles.h2}>
            About Us
            <span className={styles.en}>Inspired to Make a Difference</span>
          </h2>
          <p className={styles.p}>
            We support orphanages with transparent needs, verified by local community, and
            delivered through a coordinated logistics workflow.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Goal (English)</div>
            <div className={styles.cardBody}>
              Empower families and communities to provide safe, consistent care for orphaned
              children.
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>లక్ష్యం (Telugu)</div>
            <div className={styles.cardBody}>
              అనాథ పిల్లలకు సురక్షితమైన, నిరంతరమైన సంరక్షణ అందించేందుకు కుటుంబాలు మరియు
              సమాజాలను శక్తివంతం చేయడం.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
