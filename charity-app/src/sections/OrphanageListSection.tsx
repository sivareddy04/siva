import React, { useMemo, useState } from 'react'
import styles from './orphanageListSection.module.css'

type Orphanage = {
  id: string
  name: string
  location: string
  photoAlt: string
}

const ORPHANAGES: Orphanage[] = [
  { id: 'o1', name: 'Hope Shelter', location: 'Hyderabad, Telangana', photoAlt: 'Hope Shelter orphanage' },
  { id: 'o2', name: 'Sangam Care Home', location: 'Vijayawada, Andhra Pradesh', photoAlt: 'Sangam Care Home orphanage' },
  { id: 'o3', name: 'Annapurna Orphanage', location: 'Warangal, Telangana', photoAlt: 'Annapurna Orphanage' },
  { id: 'o4', name: 'Seva Kids Home', location: 'Tirupati, Andhra Pradesh', photoAlt: 'Seva Kids Home orphanage' }
]

export default function OrphanageListSection() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return ORPHANAGES
    return ORPHANAGES.filter((o) => (o.name + ' ' + o.location).toLowerCase().includes(t))
  }, [q])

  return (
    <section className={styles.section} aria-label="Orphanage list">
      <div className={styles.header}>
        <h2 className={styles.h2}>
          Orphanages
          <span className={styles.sub}>దాతలకు ఎంపిక</span>
        </h2>
        <p className={styles.p}>Search by name or location. Choose a verified orphanage to support.</p>

        <div className={styles.searchRow}>
          <input
            className={styles.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orphanage..."
            aria-label="Search orphanages"
          />
          <div className={styles.count}>{filtered.length} results</div>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((o) => (
          <article key={o.id} className={styles.card}>
            <div className={styles.photo} role="img" aria-label={o.photoAlt}>
              <div className={styles.photoInner} />
            </div>
            <div className={styles.body}>
              <div className={styles.name}>{o.name}</div>
              <div className={styles.location}>{o.location}</div>
              <button className={styles.selectBtn} type="button">
                Support
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
