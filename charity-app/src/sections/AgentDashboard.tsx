import React, { useMemo, useState } from 'react'
import styles from './agentDashboard.module.css'
import {
  createGoogleAppsScriptLogisticsAdapter,
  type DeliveryStatus,
  type LogisticsTaskRow,
} from '../lib/spreadsheetClient'

function badgeClass(status: DeliveryStatus) {
  if (status === 'Delivered') return styles.badgeDelivered
  if (status === 'Picked Up') return styles.badgePicked
  return styles.badgeNotStarted
}

export default function AgentDashboard() {
  const adapter = useMemo(
    () =>
      createGoogleAppsScriptLogisticsAdapter({
        scriptUrl:
          'https://script.google.com/macros/s/AKfycbxhkywHhSiCbVXb6BYya8GGmvjlx50PEvCpZGPb5ozYRjMOHes_nxhyKBBVZNo3h48a/exec',
      }),
    []
  )


  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<LogisticsTaskRow[]>([])
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      setError(null)
      setLoading(true)
      try {
        const t = await adapter.getTasks()
        if (!mounted) return
        setRows(t)
      } catch {
        if (!mounted) return
        setError('Failed to load logistics tasks.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [adapter])

  const update = async (taskId: string, next: DeliveryStatus) => {
    setError(null)
    try {
      const updated = await adapter.updateStatus(taskId, next)
      if (!updated) return
      setRows((prev) => prev.map((x) => (x.taskId === taskId ? updated : x)))
    } catch {
      setError('Failed to update delivery status.')
    }
  }

  const nextStatusFrom = (s: DeliveryStatus) => {
    if (s === 'Not Started') return 'Picked Up' as const
    if (s === 'Picked Up') return 'Delivered' as const
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Agent Dashboard</div>
        <div className={styles.subtitle}>Assigned pickups/deliveries, map routes (placeholder), and task checklist.</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>Tasks</div>

          {error ? <div className={styles.error}>{error}</div> : null}
          {loading ? <div className={styles.muted}>Loading…</div> : null}

          {!loading && rows.length === 0 ? <div className={styles.muted}>No tasks assigned.</div> : null}

          {!loading && rows.length > 0 ? (
            <div className={styles.table}>
              <div className={styles.rowHead} aria-hidden="true">
                <div>Task ID</div>
                <div>Orphanage</div>
                <div>Pickup Location</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {rows.map((t) => {
                const next = nextStatusFrom(t.deliveryStatus)
                return (
                  <div key={t.taskId} className={styles.reqRow}>
                    <div className={styles.cellTitle}>{t.taskId}</div>
                    <div className={styles.cellMain}>{t.orphanageName}</div>
                    <div className={styles.cellMain}>{t.pickupLocation}</div>
                    <div>
                      <span className={`${styles.badge} ${badgeClass(t.deliveryStatus)}`}>{t.deliveryStatus}</span>
                    </div>
                    <div className={styles.actionsCol}>
                      {next ? (
                        <button
                          className={styles.buttonPrimary}
                          type="button"
                          onClick={() => update(t.taskId, next)}
                        >
                          {next === 'Picked Up' ? 'Mark Picked Up' : 'Mark Delivered'}
                        </button>
                      ) : (
                        <button className={styles.buttonSecondary} type="button" disabled>
                          Completed
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Map Routes (Placeholder)</div>
          <div className={styles.mapBox} role="img" aria-label="Map route placeholder">
            <div className={styles.mapInner}>
              <div className={styles.mapTitle}>Route Map</div>
              <div className={styles.mapMuted}>
                Integrate with Google Maps / OpenStreetMap later. Current demo focuses on Logistics Sheet updates.
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionTitle}>Task Checklist</div>

          <div className={styles.checklist}>
            {rows.map((t) => {
              const status = t.deliveryStatus
              const checkedPicked = status === 'Picked Up' || status === 'Delivered'
              const checkedDelivered = status === 'Delivered'
              return (
                <div key={`${t.taskId}-check`} className={styles.checkCard}>
                  <div className={styles.checkTop}>
                    <div className={styles.checkTask}>{t.taskId}</div>
                    <span className={`${styles.badge} ${badgeClass(status)}`}>{status}</span>
                  </div>

                  <label className={styles.checkItem}>
                    <input type="checkbox" checked={checkedPicked} readOnly />
                    <span>Picked up from: {t.pickupLocation}</span>
                  </label>

                  <label className={styles.checkItem}>
                    <input type="checkbox" checked={checkedDelivered} readOnly />
                    <span>Delivered to: {t.orphanageName}</span>
                  </label>
                </div>
              )
            })}
            {rows.length === 0 ? <div className={styles.muted}>Checklist will appear once tasks are assigned.</div> : null}
          </div>
        </div>
      </div>

      <div className={styles.footerRow}>
        Logistics sheet columns model:
        <span className={styles.kbd}>Task ID</span>, <span className={styles.kbd}>Orphanage Name</span>,{' '}
        <span className={styles.kbd}>Pickup Location</span>, <span className={styles.kbd}>Delivery Status</span>.
      </div>
    </div>
  )
}
