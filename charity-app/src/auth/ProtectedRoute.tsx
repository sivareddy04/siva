import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Role, useAuth } from './AuthContext'

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { state } = useAuth()
  const location = useLocation()

  if (!state) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!allowedRoles.includes(state.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

