import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './registerPage.module.css'
import type { Role } from '../auth/AuthContext'
import { useAuth } from '../auth/AuthContext'

const roleOptions: Array<{ role: Role; label: string }> = [
  { role: 'DONOR', label: 'Donor' },
  { role: 'AGENT', label: 'Agent' },
  { role: 'ADMIN', label: 'Admin' },
  { role: 'ORPHANAGE', label: 'Orphanage' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const nav = useNavigate()

  const [userId, setUserId] = useState('')
  const [phone, setPhone] = useState('')
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState<Role>('DONOR')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return Boolean(userId.trim() && phone.trim() && userName.trim() && password.trim() && confirmPassword.trim())
  }, [userId, phone, userName, password, confirmPassword])

  const onSubmit = async () => {
    setError(null)
    setBusy(true)
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      const res = await register({ userId, phone, userName, role, password })
      if (!res.ok) {
        setError(res.reason)
        return
      }

      nav('/login', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.title}>User Registration (Mock)</div>
        <div className={styles.subtitle}>
          Register with userId, phone, username, role, and password. This creates a mock user for login.
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.form}>
          <label className={styles.label}>
            User ID
            <input
              className={styles.input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., DON-201 / ADMIN-002 / ORG-002"
            />
          </label>

          <label className={styles.label}>
            Phone Number
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 9876543210"
            />
          </label>

          <label className={styles.label}>
            User Name
            <input
              className={styles.input}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g., John Doe"
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

          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="create password"
            />
          </label>

          <label className={styles.label}>
            Confirm Password
            <input
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="re-enter password"
            />
          </label>

          <button
            className={styles.buttonPrimary}
            type="button"
            disabled={busy || !canSubmit}
            onClick={onSubmit}
          >
            {busy ? 'Registering…' : 'Register'}
          </button>

          <button className={styles.buttonSecondary} type="button" disabled={busy} onClick={() => nav('/login')}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

