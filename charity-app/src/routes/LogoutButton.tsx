import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import styles from './logoutButton.module.css'

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => {
        logout()
      }}
    >
      Logout
    </button>
  )
}

