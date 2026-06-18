import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './routes/PublicLayout'
import HomePage from './routes/HomePage'
import DonorDashboard from './sections/DonorDashboard'
import AgentDashboard from './sections/AgentDashboard'
import AdminDashboard from './sections/AdminDashboard'
import OrphanagesDashboard from './sections/OrphanagesDashboard'
import LoginPage from './routes/LoginPage'
import RegisterPage from './routes/RegisterPage'

import ProtectedRoute from './auth/ProtectedRoute'
import type { Role } from './auth/AuthContext'

const allowedRoles = {
  DONOR: 'DONOR' as Role,
  AGENT: 'AGENT' as Role,
  ADMIN: 'ADMIN' as Role,
  ORPHANAGE: 'ORPHANAGE' as Role,
}


export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}> 
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<HomePage variant="about" />} />
        <Route path="/impact" element={<HomePage variant="impact" />} />
        <Route path="/orphanages" element={<HomePage variant="orphanages" />} />
        <Route path="/donate" element={<HomePage variant="donate" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        <Route element={<ProtectedRoute allowedRoles={[allowedRoles.DONOR]} />}>
          <Route path="/donor" element={<DonorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[allowedRoles.AGENT]} />}>
          <Route path="/agent" element={<AgentDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[allowedRoles.ADMIN]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[allowedRoles.ORPHANAGE]} />}>
          <Route path="/orphanages-dashboard" element={<OrphanagesDashboard />} />
        </Route>

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}



