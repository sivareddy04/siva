import React from 'react'
import styles from './howItWorks.module.css'

export default function HowItWorks() {
  return (
    <section className={styles.section} aria-label="How it works">
      <div className={styles.header}>
        <h2 className={styles.h2}>
          How It Works
          <span className={styles.sub}>పూర్తి పారదర్శకత</span>
        </h2>
        <p className={styles.p}>
          Orphan Child → Verified by Local Person → Information added to website.
        </p>
      </div>

      <div className={styles.flow} role="img" aria-label="Flow diagram: Orphan Child → Verified by Local Person → Information added to website">
        <div className={styles.step}>
          <div className={styles.icon} aria-hidden>
            👶
          </div>
          <div className={styles.stepTitle}>Orphan Child</div>
        </div>

        <div className={styles.arrow} aria-hidden>
          →
        </div>

        <div className={styles.step}>
          <div className={styles.icon} aria-hidden>
            ✅
          </div>
          <div className={styles.stepTitle}>Verified by Local Person</div>
        </div>

        <div className={styles.arrow} aria-hidden>
          →
        </div>

        <div className={styles.step}>
          <div className={styles.icon} aria-hidden>
            🌐
          </div>
          <div className={styles.stepTitle}>Information added to website</div>
        </div>
      </div>
    </section>
  )
}
