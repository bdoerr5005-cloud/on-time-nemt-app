import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

export default function RequireAdmin({ children }) {
  const { admin, loading } = useAdmin()
  if (loading) return <div className="container"><div className="card">Checking access…</div></div>
  if (!admin) return <Navigate to="/" replace />
  return children
}
