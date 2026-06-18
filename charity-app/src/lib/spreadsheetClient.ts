export type DeliveryStatus = 'Not Started' | 'Picked Up' | 'Delivered'

export type LogisticsTaskRow = {
  taskId: string
  orphanageName: string
  pickupLocation: string
  deliveryStatus: DeliveryStatus
}

export type LogisticsSpreadsheetAdapter = {
  getTasks: () => Promise<LogisticsTaskRow[]>
  updateStatus: (taskId: string, nextStatus: DeliveryStatus) => Promise<LogisticsTaskRow | null>
}

/**
 * Adapter for Google Apps Script web app (script.google.com/macros/s/.../exec).
 *
 * Expected endpoints:
 * - GET/POST { action: 'getTasks' } => { ok: true, tasks: LogisticsTaskRow[] }
 * - POST { action: 'updateStatus', taskId, nextStatus } => { ok: true, row: LogisticsTaskRow }
 *
 * The server must accept CORS and return JSON.
 */
export function createGoogleAppsScriptLogisticsAdapter(params: {
  scriptUrl: string
}): LogisticsSpreadsheetAdapter {
  const { scriptUrl } = params

  const requestJson = async (body: Record<string, unknown>) => {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Spreadsheet request failed (${res.status}): ${text}`)
    }

    return res.json() as Promise<unknown>
  }

  return {
    getTasks: async () => {
      const payload = await requestJson({ action: 'getTasks' })
      const json = payload as any
      if (!json?.ok) return []
      return (json.tasks ?? []) as LogisticsTaskRow[]
    },

    updateStatus: async (taskId, nextStatus) => {
      const payload = await requestJson({ action: 'updateStatus', taskId, nextStatus })
      const json = payload as any
      if (!json?.ok) return null
      return (json.row ?? null) as LogisticsTaskRow | null
    },
  }
}

