import React, { useEffect, useMemo, useState } from 'react'
import styles from './donorDashboard.module.css'

type DonationStatus = 'Accepted' | 'Completed'

type DonationRow = {
  donorId: string
  requestId: string
  orphanageName: string
  status: DonationStatus
}

type DonationsSpreadsheetAdapter = {
  getDonationsByDonorId: (donorId: string) => Promise<DonationRow[]>
  acceptRequest: (donorId: string, requestId: string, orphanageName: string) => Promise<DonationRow[]>
  completeRequest: (donorId: string, requestId: string, orphanageName: string) => Promise<DonationRow[]>
}

function createMockDonationsSpreadsheetAdapter(seed: DonationRow[]): DonationsSpreadsheetAdapter {
  let db = [...seed]
  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  const upsert = (row: DonationRow) => {
    const idx = db.findIndex((x) => x.donorId === row.donorId && x.requestId === row.requestId)
    if (idx === -1) db = [row, ...db]
    else db = db.map((x, i) => (i === idx ? row : x))
  }

  return {
    getDonationsByDonorId: async (donorId) => {
      await delay(200)
      return db.filter((x) => x.donorId === donorId)
    },
    acceptRequest: async (donorId, requestId, orphanageName) => {
      await delay(250)
      upsert({ donorId, requestId, orphanageName, status: 'Accepted' })
      return db.filter((x) => x.donorId === donorId)
    },
    completeRequest: async (donorId, requestId, orphanageName) => {
      await delay(250)
      upsert({ donorId, requestId, orphanageName, status: 'Completed' })
      return db.filter((x) => x.donorId === donorId)
    },
  }
}

function statusBadgeClass(status: DonationStatus) {
  if (status === 'Accepted') return styles.badgeAccepted
  return styles.badgeCompleted
}

export default function DonorDashboard() {
  const adapter = useMemo(
    () =>
      createMockDonationsSpreadsheetAdapter([
        { donorId: 'DON-101', requestId: 'REQ-A1B2-1042', orphanageName: 'Green Hope Orphanage', status: 'Accepted' },
        { donorId: 'DON-101', requestId: 'REQ-C3D4-1120', orphanageName: 'Sunrise Orphanage', status: 'Completed' },
      ]),
    []
  )

  const [donorId, setDonorId] = useState('DON-101')
  const [rows, setRows] = useState<DonationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo-only: in a real app, available requests would come from Orphanage "Needs" sheet.
  const availableRequests = useMemo(
    () => [
      { requestId: 'REQ-A1B2-1042', orphanageName: 'Green Hope Orphanage' },
      { requestId: 'REQ-C3D4-1120', orphanageName: 'Sunrise Orphanage' },
      { requestId: 'REQ-E5F6-0987', orphanageName: 'Bridge of Smiles Orphanage' },
    ],
    []
  )

  const refresh = async (id: string) => {
    setError(null)
    if (!id.trim()) {
      setRows([])
      return
    }
    setLoading(true)
    try {
      const next = await adapter.getDonationsByDonorId(id.trim())
      setRows(next)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh(donorId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const existingMap = useMemo(() => {
    const map = new Map<string, DonationRow>()
    for (const r of rows) map.set(r.requestId, r)
    return map
  }, [rows])

  const accept = async (requestId: string, orphanageName: string) => {
    const id = donorId.trim()
    if (!id) return
    setError(null)
    setLoading(true)
    try {
      const next = await adapter.acceptRequest(id, requestId, orphanageName)
      setRows(next)
    } catch {
      setError('Failed to accept request.')
    } finally {
      setLoading(false)
    }
  }

  const complete = async (requestId: string, orphanageName: string) => {
    const id = donorId.trim()
    if (!id) return
    setError(null)
    setLoading(true)
    try {
      const next = await adapter.completeRequest(id, requestId, orphanageName)
      setRows(next)
    } catch {
      setError('Failed to complete support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Donor Dashboard</div>
        <div className={styles.subtitle}>Pending orphanage requests with actions stored in “Donations” sheet.</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>Donor</div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.form}>
            <label className={styles.label}>
              Donor ID / நன்கொடையாளர் ID
              <input
                className={styles.input}
                value={donorId}
                onChange={(e) => setDonorId(e.target.value)}
                placeholder="e.g., DON-101"
              />
            </label>

            <div className={styles.actionsRow}>
              <button className={styles.buttonPrimary} type="button" onClick={() => refresh(donorId)} disabled={loading}>
                Load My Requests
              </button>
              <div className={styles.note}>Mock spreadsheet adapter emulates Donations Sheet write-backs.</div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionTitle}>Available Requests</div>
          <div className={styles.miniList}>
            {availableRequests.map((req) => {
              const existing = existingMap.get(req.requestId)
              const status = existing?.status

              const canAccept = status !== 'Accepted' && status !== 'Completed'
              const canComplete = status === 'Accepted'

              return (
                <div key={req.requestId} className={styles.miniRow}>
                  <div>
                    <div className={styles.miniTitle}>{req.orphanageName}</div>
                    <div className={styles.miniMuted}>
                      Request ID: <span className={styles.kbd}>{req.requestId}</span>
                    </div>
                  </div>

                  <div className={styles.miniActions}>
                    {canAccept ? (
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        disabled={loading || !donorId.trim()}
                        onClick={() => accept(req.requestId, req.orphanageName)}
                      >
                        Accept
                      </button>
                    ) : null}

                    {canComplete ? (
                      <button
                        className={styles.buttonPrimary}
                        type="button"
                        disabled={loading || !donorId.trim()}
                        onClick={() => complete(req.requestId, req.orphanageName)}
                      >
                        Provide Support
                      </button>
                    ) : null}

                    {status ? (
                      <span className={`${styles.badge} ${statusBadgeClass(status)}`}>{status}</span>
                    ) : (
                      <span className={styles.miniMuted}>Not started</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className={styles.footerRow}>
            Donations sheet columns model:
            <span className={styles.kbd}>Donor ID</span>, <span className={styles.kbd}>Request ID</span>,{' '}
            <span className={styles.kbd}>Orphanage Name</span>, <span className={styles.kbd}>Status</span> (Accepted/Completed).
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>My Donation Records</div>

          {loading ? <div className={styles.muted}>Loading…</div> : null}
          {!loading && rows.length === 0 ? <div className={styles.muted}>No records yet for this Donor ID.</div> : null}

          {rows.length > 0 ? (
            <div className={styles.table}>
              <div className={styles.rowHead} aria-hidden="true">
                <div>Request ID</div>
                <div>Orphanage</div>
                <div>Status</div>
              </div>

              {rows.map((r) => (
                <div className={styles.reqRow} key={`${r.donorId}-${r.requestId}`}>
                  <div className={styles.cellTitle}>{r.requestId}</div>
                  <div className={styles.muted}>{r.orphanageName}</div>
                  <div>
                    <span className={`${styles.badge} ${statusBadgeClass(r.status)}`}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
