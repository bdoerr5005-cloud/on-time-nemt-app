import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'

export default function Home() {
  const { user } = useAuth()
  const { admin } = useAdmin()

  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h2>Today’s workflows</h2>
          <div className="small">Complete required items before (and during) service. Everything is time-stamped and stored for audits.</div>
          <hr/>
          <div className="list">
            <Link className="btn primary" to="/pretrip">✅ Daily Pre-Trip Inspection</Link>
            <Link className="btn primary" to="/cleaning">🧼 Cleaning Checklist</Link>
            <Link className="btn danger" to="/incident">🚨 Incident / Accident Report</Link>
            <Link className="btn" to="/maintenance">🛠️ Maintenance Note / Log</Link>
          </div>
          <hr/>
          <div className="small">Signed in as: {user?.email}</div>
        </div>

        <div className="card">
          <h2>Management</h2>
          <div className="small">Monthly review and dashboards.</div>
          <hr />
          <div className="list">
            <Link className="btn" to="/monthly-review">📋 Monthly Ops & Safety Review</Link>
            <Link className="btn" to="/resources">📚 Resources (Standards & Securement)</Link>
            {admin ? <Link className="btn primary" to="/admin">📊 Admin Dashboard</Link> : <div className="small">Admin dashboard requires access.</div>}
          </div>
          <hr />
          <div className="badge">Defaults: login ✅ photos ✅ offline ✅</div>
        </div>
      </div>
    </div>
  )
}
