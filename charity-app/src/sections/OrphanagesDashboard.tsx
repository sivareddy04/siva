import React, { useEffect, useMemo, useState } from 'react'
import styles from './orphanagesDashboard.module.css'

type VerificationStatus = 'Needs Verification' | 'Verified' | 'Rejected'

type Urgency = 'Low' | 'Medium' | 'High'

type NeedsRow = {
  requestId: string
  title: string
  quantity: number
  urgency: Urgency
  description: string
  status: VerificationStatus
}

type NeedsSpreadsheetAdapter = {
  getNeeds: () => Promise<NeedsRow[]>
  addNeed: (row: Omit<NeedsRow, 'requestId' | 'status'>) => Promise<NeedsRow>
  verifyNeed: (requestId: string, nextStatus: VerificationStatus) => Promise<NeedsRow | null>
}

function createMockNeedsSpreadsheetAdapter(seed: NeedsRow[]): NeedsSpreadsheetAdapter {
  let db = [...seed]

  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  return {
    getNeeds: async () => {
      await delay(200)
      return [...db]
    },
    addNeed: async (row) => {
      await delay(250)
      const nextId = `REQ-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`
      const created: NeedsRow = {
        requestId: nextId,
        status: 'Needs Verification',
        ...row,
      }
      db = [created, ...db]
      return created
    },
    verifyNeed: async (requestId, nextStatus) => {
      await delay(200)
      const idx = db.findIndex((x) => x.requestId === requestId)
      if (idx === -1) return null
      db = db.map((x) => (x.requestId === requestId ? { ...x, status: nextStatus } : x))
      return db[idx]
    },
  }
}

function statusBadgeClass(status: VerificationStatus) {
  if (status === 'Needs Verification') return styles.badgeNeeds
  if (status === 'Verified') return styles.badgeVerified
  return styles.badgeRejected
}

export default function OrphanagesDashboard() {
  const adapter = useMemo(
    () =>
      createMockNeedsSpreadsheetAdapter([
        {
          requestId: 'REQ-A1B2-1042',
          title: 'Rice & Pulses Packets',
          quantity: 200,
          urgency: 'High',
          description: 'Need 200 packets for 2 weeks.',
          status: 'Needs Verification',
        },
        {
          requestId: 'REQ-C3D4-1120',
          title: 'Winter Sweaters (Kids)',
          quantity: 48,
          urgency: 'Medium',
          description: 'Medium priority for upcoming cold season.',
          status: 'Verified',
        },
        {
          requestId: 'REQ-E5F6-0987',
          title: 'Diapers',
          quantity: 120,
          urgency: 'High',
          description: 'Urgent replacement. Some sizes may vary.',
          status: 'Rejected',
        },
      ]),
    []
  )

  const [rows, setRows] = useState<NeedsRow[]>([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [quantity, setQuantity] = useState<number>(0)
  const [urgency, setUrgency] = useState<Urgency>('Low')
  const [description, setDescription] = useState('')

  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // Load initial data once
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const initial = await adapter.getNeeds()
      if (!mounted) return
      setRows(initial)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [adapter])

  const activeRows = rows // placeholder for future filtering (e.g., only "active" statuses)

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false
    if (!Number.isFinite(quantity) || quantity <= 0) return false
    if (!description.trim()) return false
    return true
  }, [title, quantity, description])

  const submit = async () => {
    setFormError(null)
    setFormSuccess(null)

    if (!title.trim()) {
      setFormError('Title is required.')
      return
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setFormError('Quantity must be greater than 0.')
      return
    }
    if (!description.trim()) {
      setFormError('Description is required.')
      return
    }

    const created = await adapter.addNeed({
      title: title.trim(),
      quantity,
      urgency,
      description: description.trim(),
    })

    setRows((prev) => [created, ...prev])
    setFormSuccess('Request submitted. Waiting for verification.')
    setTitle('')
    setQuantity(0)
    setUrgency('Low')
    setDescription('')
  }

  const verify = async (requestId: string, nextStatus: VerificationStatus) => {
    const updated = await adapter.verifyNeed(requestId, nextStatus)
    if (!updated) return
    setRows((prev) => prev.map((x) => (x.requestId === requestId ? updated : x)))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Orphanage Dashboard</div>
        <div className={styles.subtitle}>Submit new “Needs” requests and track verification status.</div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>Submit a Need (Request)</div>

          {formError ? <div className={styles.error}>{formError}</div> : null}
          {formSuccess ? <div className={styles.success}>{formSuccess}</div> : null}

          <div className={styles.form}>
            <label className={styles.label}>
              Title / தலைப்பு
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., School Uniforms"
              />
            </label>

            <label className={styles.label}>
              Quantity / அளவு
              <input
                className={styles.input}
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="e.g., 100"
              />
            </label>

            <label className={styles.label}>
              Urgency / அவசரம்
              <select className={styles.select} value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
                <option value="Low">Low / குறைவு</option>
                <option value="Medium">Medium / நடுத்தரம்</option>
                <option value="High">High / அதிகம்</option>
              </select>
            </label>

            <label className={styles.label}>
              Description / விளக்கம்
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short details about the need…"
              />
            </label>

            <div className={styles.actionsRow}>
              <button className={styles.buttonPrimary} disabled={!canSubmit} onClick={submit} type="button">
                Submit Request
              </button>
              <div className={styles.note}>Mock adapter simulates Google Sheets/Excel integration.</div>
            </div>
          </div>

          <div className={styles.footerRow}>
            Spreadsheet columns model:
            <span className={styles.kbd}>Request ID</span>, <span className={styles.kbd}>Title</span>,{' '}
            <span className={styles.kbd}>Quantity</span>, <span className={styles.kbd}>Urgency</span>,{' '}
            <span className={styles.kbd}>Description</span>, <span className={styles.kbd}>Status</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Active Requests</div>

          {loading ? <div className={styles.muted}>Loading…</div> : null}

          {activeRows.length === 0 && !loading ? (
            <div className={styles.muted}>No requests yet. Submit the first one.</div>
          ) : null}

          {activeRows.length > 0 ? (
            <div className={styles.table}>
              <div className={styles.rowHead} aria-hidden="true">
                <div>Request ID</div>
                <div>Title</div>
                <div>Qty</div>
                <div>Urgency</div>
                <div>Description</div>
                <div>Status</div>
              </div>

              {activeRows.map((r) => (
                <div className={styles.reqRow} key={r.requestId}>
                  <div className={styles.cellTitle}>{r.requestId}</div>
                  <div>
                    <div className={styles.smallLabel}>Title</div>
                    <div className={styles.cellTitle}>{r.title}</div>
                  </div>
                  <div>
                    <div className={styles.smallLabel}>Qty</div>
                    <div className={styles.cellTitle}>{r.quantity}</div>
                  </div>
                  <div>
                    <div className={styles.smallLabel}>Urgency</div>
                    <div className={styles.cellTitle}>{r.urgency}</div>
                  </div>
                  <div>
                    <div className={styles.smallLabel}>Description</div>
                    <div className={styles.muted}>{r.description}</div>
                  </div>

                  <div>
                    <div className={styles.smallLabel}>Status</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span className={`${styles.badge} ${statusBadgeClass(r.status)}`}>{r.status}</span>

                      <div className={styles.actionsRow} style={{ marginTop: 0 }}>
                        {r.status !== 'Verified' ? (
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() => verify(r.requestId, 'Verified')}
                          >
                            Verify
                          </button>
                        ) : null}
                        {r.status !== 'Rejected' ? (
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() => verify(r.requestId, 'Rejected')}
                          >
                            Reject
                          </button>
                        ) : null}
                      </div>
                    </div>
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
