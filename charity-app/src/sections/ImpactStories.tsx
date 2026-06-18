import React from 'react'
import styles from './impactStories.module.css'

type Story = {
  title: string
  titleTe: string
  body: string
  bodyTe: string
  stat: string
  imgAlt: string
}

const stories: Story[] = [
  {
    title: 'Local Individuals',
    titleTe: 'స్థానిక వ్యక్తులు',
    body: 'Small, verified support helps families restore stability—one need at a time.',
    bodyTe: 'చిన్నదైన కానీ ధృవీకరించిన సహాయం ద్వారా కుటుంబాలకు స్థిరత్వం తిరిగి వస్తుంది.',
    stat: '300+',
    imgAlt: 'Local impact photo'
  },
  {
    title: 'Empowering Single Women',
    titleTe: 'ఒంటరి మహిళలను శక్తివంతం',
    body: 'Education and essentials to help women build safe, independent lives.',
    bodyTe: 'విద్యా మరియు అవసరాలు—సురక్షితమైన, స్వతంత్ర జీవితాలను నిర్మించేందుకు.',
    stat: '120+',
    imgAlt: 'Women empowerment photo'
  },
  {
    title: 'Safe Orphanage Community',
    titleTe: 'సురక్షిత అనాథ శిబిరం సమాజం',
    body: 'A verified community network ensures children receive consistent care and resources.',
    bodyTe: 'ధృవీకరించిన సమాజ నెట్‌వర్క్ ద్వారా పిల్లలకు నిరంతర సంరక్షణ లభిస్తుంది.',
    stat: '50+',
    imgAlt: 'Orphanage community photo'
  }
]

export default function ImpactStories() {
  return (
    <section className={styles.section} aria-label="Impact Stories">
      <div className={styles.header}>
        <h2 className={styles.h2}>
          Impact Stories
          <span className={styles.sub}>స్ఫూర్తిదాయక మార్పులు</span>
        </h2>
        <p className={styles.p}>Real stories, real outcomes, real accountability.</p>
      </div>

      <div className={styles.grid}>
        {stories.map((s) => (
          <article key={s.title} className={styles.card}>
            <div className={styles.photo} role="img" aria-label={s.imgAlt}>
              <div className={styles.photoInner} />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>
                <div className={styles.titleRow}>
                  <span>{s.title}</span>
                  <span className={styles.stat}>{s.stat}</span>
                </div>
                <div className={styles.titleTe}>{s.titleTe}</div>
              </div>

              <p className={styles.body}>{s.body}</p>
              <p className={styles.bodyTe}>{s.bodyTe}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
