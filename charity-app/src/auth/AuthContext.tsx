import React, { createContext, useContext, useMemo, useState } from 'react'

export type Role = 'DONOR' | 'AGENT' | 'ADMIN' | 'ORPHANAGE'

export type AuthState = {
  userId: string
  role: Role
} | null

type UserStatus = 'Active' | 'Pending Review' | 'Suspended'

type LoginFn = (
  userId: string,
  role: Role,
  password: string,
) => Promise<{ ok: true; state: Exclude<AuthState, null> } | { ok: false; reason: string }>

type RegisterFn = (params: {
  userId: string
  phone: string
  userName: string
  role: Role
  password: string
}) => Promise<{ ok: true } | { ok: false; reason: string }>

type AuthContextValue = {
  state: AuthState
  login: LoginFn
  register: RegisterFn
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Mock spreadsheet-based user verification.
// This is intentionally in-memory and mirrors the existing “mock adapter” style.
const mockUserTable: Array<{
  userId: string
  role: Role
  name: string
  phone: string
  password: string
  status: UserStatus
}> = [
  // password for demo users is always 'admin' (matches existing UI expectations)
  { userId: 'DON-101', role: 'DONOR', name: 'Demo Donor', phone: '9999999999', password: 'admin', status: 'Active' },
  { userId: 'U-AG-2001', role: 'AGENT', name: 'Demo Agent (Pending)', phone: '9999999999', password: 'admin', status: 'Pending Review' },
  { userId: 'U-AG-2002', role: 'AGENT', name: 'Demo Agent (Suspended)', phone: '9999999999', password: 'admin', status: 'Suspended' },
  { userId: 'U-DR-1001', role: 'DONOR', name: 'Demo Donor from Admin seed', phone: '9999999999', password: 'admin', status: 'Active' },
  { userId: 'ORG-001', role: 'ORPHANAGE', name: 'Demo Orphanage', phone: '9999999999', password: 'admin', status: 'Active' },
  { userId: 'ADMIN-001', role: 'ADMIN', name: 'Demo Admin', phone: '9999999999', password: 'admin', status: 'Active' },
]

function mockSpreadsheetLogin(userId: string, role: Role, password: string) {
  const row = mockUserTable.find((u) => u.userId === userId && u.role === role)
  if (!row) return null

  // Mock password check (for now). In real flow, verify from spreadsheet/Apps Script.
  const expected = 'admin' // simple default for demo
  if (password !== expected) return null

  // Admin process controls whether the user is allowed to login.
  if (row.status !== 'Active') return null

  return row
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(null)

  const value = useMemo<AuthContextValue>(() => {
    const login: LoginFn = async (userId, role, password) => {
      const trimmed = userId.trim()

      if (!trimmed) return { ok: false, reason: 'User ID is required.' }

      await new Promise<void>((r) => setTimeout(r, 250))

      const ok = mockSpreadsheetLogin(trimmed, role, password)

      if (!ok) return { ok: false, reason: 'Invalid credentials or account not Active.' }

      return { ok: true, state: { userId: trimmed, role } }
    }

    const register: RegisterFn = async ({ userId, phone, userName, role, password }) => {
      const trimmedId = userId.trim()
      const trimmedName = userName.trim()
      const trimmedPhone = phone.trim()

      if (!trimmedId) return { ok: false, reason: 'User ID is required.' }
      if (!trimmedName) return { ok: false, reason: 'User name is required.' }
      if (!trimmedPhone) return { ok: false, reason: 'Phone number is required.' }
      if (!password.trim()) return { ok: false, reason: 'Password is required.' }
      if (trimmedPhone.length < 8) return { ok: false, reason: 'Phone number looks too short.' }

      // Prevent duplicates in the mock table.
      if (mockUserTable.some((u) => u.userId === trimmedId && u.role === role)) {
        return { ok: false, reason: 'This userId/role already exists. Please login.' }
      }

      // Registration creates the user as Pending Review (admin will activate later).
      // Also: Block admin creation via registration.
      if (role === 'ADMIN') {
        return { ok: false, reason: 'Admin accounts can only be created/approved by existing admin.' }
      }

      mockUserTable.push({
        userId: trimmedId,
        role,
        name: trimmedName,
        phone: trimmedPhone,
        password,
        status: 'Pending Review',
      })

      return { ok: true }
    }

    const logout = () => setState(null)

    return { state, login, register, logout }
  }, [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}


