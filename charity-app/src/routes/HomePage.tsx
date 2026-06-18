import React from 'react'
import styles from './homePage.module.css'
import AboutSection from '../sections/AboutSection'
import ImpactStories from '../sections/ImpactStories'
import HowItWorks from '../sections/HowItWorks'
import OrphanageListSection from '../sections/OrphanageListSection'
import DonationTransparency from '../sections/DonationTransparency'
import { PublicVariant } from '../types'
import DonateHero from '../sections/DonateHero'

export default function HomePage({ variant }: { variant?: PublicVariant }) {
  const v: PublicVariant = variant ?? 'home'

  return (
    <div className={styles.wrap}>
      <DonateHero variant={v} />

      {v === 'home' && (
        <>
          <AboutSection />
          <ImpactStories />
          <HowItWorks />
          <OrphanageListSection />
          <DonationTransparency />
        </>
      )}

      {v !== 'home' && (
        <>
          {v === 'about' && <AboutSection />}
          {v === 'impact' && <ImpactStories />}
          {v === 'orphanages' && <OrphanageListSection />}
          {v === 'donate' && <DonationTransparency />}
        </>
      )}
    </div>
  )
}

