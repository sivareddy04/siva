import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './loginPage.module.css'
import { Role, useAuth } from '../auth/AuthContext'

const roleOptions: Array<{ role: Role; label: string }> = [
  { role: 'DONOR', label: 'Donor' },
  { role: 'AGENT', label: 'Agent' },
  { role: 'ADMIN', label: 'Admin' },
  { role: 'ORPHANAGE', label: 'Orphanage' },
]

export default function LoginPage() {
  const { login, state } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as { state?: { from?: string } }

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('DONOR')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)


  const from = loc.state?.from || '/' 

  const onSubmit = async () => {
    setError(null)
    setBusy(true)
    try {
      const res = await login(userId, role, password.trim())


      if (!res.ok) {
        setError(res.reason)
        return
      }

      // If already logged in and role matches, redirect.
      nav(from, { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>Role Login (Mock Spreadsheet)</div>
        <div className={styles.subtitle}>Enter a User ID and choose a role. This validates against mock spreadsheet data.</div>

        {state ? (
          <div className={styles.success}>Already logged in as {state.role} ({state.userId}). Redirecting…</div>
        ) : null}

        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.form}>
          <label className={styles.label}>
            User ID
            <input
              className={styles.input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., DON-101 / ADMIN-001 / ORG-001"
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter password (mock)"
            />
          </label>

          <label className={styles.label}>
            Role
            <select className={styles.select} value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {roleOptions.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <button className={styles.buttonPrimary} type="button" disabled={busy} onClick={onSubmit}>
            {busy ? 'Logging in…' : 'Login'}
          </button>


          <div className={styles.note}>
            Demo IDs: DONOR=<span className={styles.kbd}>DON-101</span>, AGENT=<span className={styles.kbd}>U-AG-2001</span>,
            ADMIN=<span className={styles.kbd}>ADMIN-001</span>, ORPHANAGE=<span className={styles.kbd}>ORG-001</span>.
          </div>
        </div>
      </div>
    </div>
  )
}

