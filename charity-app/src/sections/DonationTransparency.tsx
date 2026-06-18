import React from 'react'
import styles from './donationTransparency.module.css'

const DONATION_DESTINATIONS = [
  {
    name: 'Local Verified Needs',
    nameTe: 'స్థానిక ధృవీకరించిన అవసరాలు',
    imgAlt: 'Needs support photo'
  },
  {
    name: 'Empower Women & Families',
    nameTe: 'మహిళలు & కుటుంబాలను శక్తివంతం',
    imgAlt: 'Empowerment support photo'
  },
  {
    name: 'Safe Orphanage Community',
    nameTe: 'సురక్షిత అనాథ సమాజం',
    imgAlt: 'Orphanage community support photo'
  }
]

export default function DonationTransparency() {
  return (
    <section className={styles.section} id="pay" aria-label="Donation Transparency">
      <div className={styles.header}>
        <h2 className={styles.h2}>
          Donation Transparency
          <span className={styles.sub}>నిధులు ఎక్కడకు వెళ్తాయి</span>
        </h2>
        <p className={styles.p}>
          Donations are routed to verified needs, shown with accountability and impact updates.
        </p>
      </div>

      <div className={styles.grid}>
        {DONATION_DESTINATIONS.map((d) => (
          <article key={d.name} className={styles.card}>
            <div className={styles.photo} role="img" aria-label={d.imgAlt}>
              <div className={styles.photoInner} />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{d.name}</div>
              <div className={styles.cardTe}>{d.nameTe}</div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.ctaRow}>
        <a className={styles.payBtn} href="#donate">
          Pay Online
        </a>
        <div className={styles.note}>Green highlight indicates quick, secure donation action.</div>
      </div>
    </section>
  )
}
