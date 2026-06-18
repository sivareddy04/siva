import React from 'react'
import styles from './donateHero.module.css'
import { PublicVariant } from '../types'

export default function DonateHero({ variant }: { variant: PublicVariant }) {
  const title =
    variant === 'donate'
      ? 'Donate to Help Lives'
      : 'Inspired to Make a Difference'

  return (
    <section className={styles.hero} aria-label="Donate banner">
      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 className={styles.h1}>{title}</h1>
          <p className={styles.p}>
            <strong>Inspired to Make a Difference</strong>
            <br />
            <span className={styles.tel}>భేదాన్ని తీసుకురావడానికి ప్రేరణ</span>
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.cta} href="#pay">
              Donate Now
            </a>
            <div className={styles.smallNote}>
              Trusted & transparent support for orphanages.
            </div>
          </div>
        </div>

        <div className={styles.right} aria-hidden="true">
          <div className={styles.badge}>Verified Community</div>
          <div className={styles.impactStat}>
            <div className={styles.statNum}>+500</div>
            <div className={styles.statLabel}>Children helped</div>
          </div>
        </div>
      </div>
    </section>
  )
}
