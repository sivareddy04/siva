import React, { useEffect, useMemo, useState } from 'react'
import styles from './adminDashboard.module.css'

type AuditLevel = 'INFO' | 'WARN' | 'ACTION'

type AuditLogRow = {
  id: string
  atISO: string
  actorRole: 'ADMIN'
  action: string
  detail: string
}

type UserStatus = 'Active' | 'Pending Review' | 'Suspended'
type UserRow = {
  userId: string
  name: string
  role: 'Donor' | 'Agent'
  status: UserStatus
}

type NeedsRow = {
  requestId: string
  title: string
  quantity: number
  urgency: 'Low' | 'Medium' | 'High'
  description: string
  status: 'Active' | 'Completed' | 'Rejected'
}

type DonationRow = {
  donorId: string
  requestId: string
  orphanageName: string
  status: 'Accepted' | 'Completed'
}

type LogisticsTaskRow = {
  taskId: string
  orphanageName: string
  pickupLocation: string
  deliveryStatus: 'Assigned' | 'Picked Up' | 'Delivered'
}

type AdminSpreadsheetAdapter = {
  getStatsAndTables: () => Promise<{
    users: UserRow[]
    auditLogs: AuditLogRow[]
    needs: NeedsRow[]
    donations: DonationRow[]
    logistics: LogisticsTaskRow[]
  }>
  setUserStatus: (userId: string, nextStatus: UserStatus) => Promise<UserRow | null>
  appendAudit: (row: Omit<AuditLogRow, 'id' | 'atISO' | 'actorRole'>) => Promise<AuditLogRow>
}

function createMockAdminSpreadsheetAdapter(seed: {
  users: UserRow[]
  auditLogs: AuditLogRow[]
  needs: NeedsRow[]
  donations: DonationRow[]
  logistics: LogisticsTaskRow[]
}): AdminSpreadsheetAdapter {
  let users = [...seed.users]
  let auditLogs = [...seed.auditLogs]
  const needs = [...seed.needs]
  const donations = [...seed.donations]
  const logistics = [...seed.logistics]

  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  return {
    getStatsAndTables: async () => {
      await delay(200)
      return {
        users: [...users],
        auditLogs: [...auditLogs].sort((a, b) => (a.atISO < b.atISO ? 1 : -1)),
        needs: [...needs],
        donations: [...donations],
        logistics: [...logistics],
      }
    },
    setUserStatus: async (userId, nextStatus) => {
      await delay(250)
      const idx = users.findIndex((u) => u.userId === userId)
      if (idx === -1) return null
      users = users.map((u) => (u.userId === userId ? { ...u, status: nextStatus } : u))
      return users[idx]
    },
    appendAudit: async ({ action, detail }) => {
      await delay(150)
      const row: AuditLogRow = {
        id: `AUD-${Math.random().toString(16).slice(2, 7).toUpperCase()}`,
        atISO: new Date().toISOString(),
        actorRole: 'ADMIN',
        action,
        detail,
      }
      auditLogs = [row, ...auditLogs]
      return row
    },
  }
}

function statusBadgeClass(status: UserStatus) {
  if (status === 'Active') return styles.badgeActive
  if (status === 'Pending Review') return styles.badgePending
  return styles.badgeSuspended
}

export default function AdminDashboard() {
  const adapter = useMemo(
    () =>
      createMockAdminSpreadsheetAdapter({
        users: [
          { userId: 'U-DR-1001', name: 'Ravi', role: 'Donor', status: 'Active' },
          { userId: 'U-AG-2001', name: 'Karthik', role: 'Agent', status: 'Pending Review' },
          { userId: 'U-AG-2002', name: 'Meena', role: 'Agent', status: 'Suspended' },
        ],
        auditLogs: [
          {
            id: 'AUD-INIT-1',
            atISO: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            actorRole: 'ADMIN',
            action: 'SYSTEM_SEED',
            detail: 'Initial mock data loaded from Needs/Donations/Logistics sheets.',
          },
        ],
        needs: [
          { requestId: 'REQ-A1B2-1042', title: 'Rice & Pulses Packets', quantity: 200, urgency: 'High', description: '2 weeks supply', status: 'Active' },
          { requestId: 'REQ-C3D4-1120', title: 'Winter Sweaters (Kids)', quantity: 48, urgency: 'Medium', description: 'Cold season', status: 'Completed' },
          { requestId: 'REQ-E5F6-0987', title: 'Diapers', quantity: 120, urgency: 'High', description: 'Replacement stock', status: 'Active' },
        ],
        donations: [
          { donorId: 'DON-101', requestId: 'REQ-A1B2-1042', orphanageName: 'Green Hope Orphanage', status: 'Accepted' },
          { donorId: 'DON-101', requestId: 'REQ-C3D4-1120', orphanageName: 'Sunrise Orphanage', status: 'Completed' },
        ],
        logistics: [
          { taskId: 'TASK-501', orphanageName: 'Green Hope Orphanage', pickupLocation: 'Warehouse A', deliveryStatus: 'Assigned' },
          { taskId: 'TASK-502', orphanageName: 'Sunrise Orphanage', pickupLocation: 'Warehouse A', deliveryStatus: 'Delivered' },
        ],
      }),
    []
  )

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [users, setUsers] = useState<UserRow[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([])

  const [needs, setNeeds] = useState<NeedsRow[]>([])
  const [donations, setDonations] = useState<DonationRow[]>([])
  const [logistics, setLogistics] = useState<LogisticsTaskRow[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await adapter.getStatsAndTables()
        if (!mounted) return
        setUsers(data.users)
        setAuditLogs(data.auditLogs)
        setNeeds(data.needs)
        setDonations(data.donations)
        setLogistics(data.logistics)
        setError(null)
      } catch {
        if (!mounted) return
        setError('Failed to load admin dashboard data.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [adapter])

  const stats = useMemo(() => {
    const userCount = users.length
    const activeNeeds = needs.filter((n) => n.status === 'Active').length
    const donationsAssigned = donations.filter((d) => d.status === 'Accepted').length
    return { userCount, activeNeeds, donationsAssigned, auditCount: auditLogs.length }
  }, [users, needs, donations, auditLogs])

  const [moderatingUserId, setModeratingUserId] = useState<string | null>(null)
  const moderateUser = async (userId: string, nextStatus: UserStatus) => {
    setError(null)
    setModeratingUserId(userId)
    try {
      const updated = await adapter.setUserStatus(userId, nextStatus)
      if (!updated) {
        setError('User not found.')
        return
      }
      setUsers((prev) => prev.map((u) => (u.userId === userId ? updated : u)))

      await adapter.appendAudit({
        action: 'USER_MODERATION',
        detail: `User ${userId} status changed to ${nextStatus}.`,
      })

      // Refresh audit logs
      const data = await adapter.getStatsAndTables()
      setAuditLogs(data.auditLogs)
    } catch {
      setError('Moderation action failed.')
    } finally {
      setModeratingUserId(null)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Admin Dashboard</div>
        <div className={styles.subtitle}>Mock statistics pulled from Needs, Donations, and Logistics sheets.</div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      {loading ? <div className={styles.muted}>Loading…</div> : null}

      {!loading ? (
        <>
          <div className={styles.statsGrid} aria-label="Admin statistics">
            <div className={styles.statCard}>
              <div className={styles.statLabel}>User Count</div>
              <div className={styles.statValue}>{stats.userCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Active Needs</div>
              <div className={styles.statValue}>{stats.activeNeeds}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Donations Assigned</div>
              <div className={styles.statValue}>{stats.donationsAssigned}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Audit Logs</div>
              <div className={styles.statValue}>{stats.auditCount}</div>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.sectionTitle}>User Moderation</div>
              <div className={styles.sectionHint}>Approve or suspend users (mocked in-memory).</div>

              <div className={styles.table}>
                <div className={styles.rowHead} aria-hidden="true">
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>

                {users.map((u) => (
                  <div className={styles.row} key={u.userId}>
                    <div className={styles.cellMain}>
                      <div className={styles.cellTitle}>{u.name}</div>
                      <div className={styles.cellMuted}>{u.userId}</div>
                    </div>
                    <div className={styles.cellMuted}>{u.role}</div>
                    <div>
                      <span className={`${styles.badge} ${statusBadgeClass(u.status)}`}>{u.status}</span>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        disabled={moderatingUserId === u.userId}
                        onClick={() => moderateUser(u.userId, 'Active')}
                      >
                        Approve
                      </button>
                      <button
                        className={styles.buttonDanger}
                        type="button"
                        disabled={moderatingUserId === u.userId}
                        onClick={() => moderateUser(u.userId, 'Suspended')}
                      >
                        Suspend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitle}>Audit Logs</div>
              <div className={styles.sectionHint}>Actions recorded whenever moderation occurs.</div>

              <div className={styles.auditList}>
                {auditLogs.length === 0 ? <div className={styles.muted}>No audit logs.</div> : null}

                {auditLogs.slice(0, 20).map((l) => (
                  <div key={l.id} className={styles.auditRow}>
                    <div className={styles.auditTop}>
                      <span className={styles.auditAction}>{l.action}</span>
                      <span className={styles.auditTime}>
                        {new Date(l.atISO).toLocaleString(undefined, { hour12: false })}
                      </span>
                    </div>
                    <div className={styles.auditDetail}>{l.detail}</div>
                  </div>
                ))}
              </div>

              <div className={styles.footerRow}>
                Spreadsheet columns model:
                <span className={styles.kbd}>User Count</span>, <span className={styles.kbd}>Active Needs</span>,{' '}
                <span className={styles.kbd}>Donations Assigned</span>, <span className={styles.kbd}>Audit Logs</span>.
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Maps placeholders (no external services) */}
      <div className={styles.footerNote}>
        No external calls are made. This Admin Dashboard uses a mock adapter combining totals from Needs/Donations/Logistics.
      </div>
    </div>
  )
}
