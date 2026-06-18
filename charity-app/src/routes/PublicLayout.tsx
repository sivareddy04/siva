import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './publicLayout.module.css'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/impact', label: 'Impact' },
  { to: '/orphanages', label: 'Orphanages' },
  { to: '/donate', label: 'Donate' },
]

export default function PublicLayout() {
  const location = useLocation()
  const { state } = useAuth()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden>
            ✦
          </div>
          <div>
            <div className={styles.brandName}>Charity</div>
            <div className={styles.brandTag}>Inspired to Make a Difference</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item) => {
            const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={active ? styles.navLinkActive : styles.navLink}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className={styles.actions}>
          {!state ? (
            <Link to="/login" className={styles.donateBtn}>
              Login
            </Link>
          ) : (
            <Link to="/donate" className={styles.donateBtn}>
              Donate
            </Link>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Charity Platform</span>
      </footer>
    </div>
  )
}


