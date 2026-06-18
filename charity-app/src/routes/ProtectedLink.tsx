import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { Role } from '../auth/AuthContext'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedLink({
  allowedRoles,
  ...props
}: LinkProps & { allowedRoles: Role[] }) {
  const { state } = useAuth()

  const allowed = state ? allowedRoles.includes(state.role) : false

  // If not allowed, render disabled-looking link without navigation.
  if (!allowed) {
    return (
      <span
        style={{
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      >
        {props.children}
      </span>
    )
  }

  return <Link {...props} />
}

