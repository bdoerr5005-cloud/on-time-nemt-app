import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'

import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Checklist from './pages/Checklist.jsx'
import Incident from './pages/Incident.jsx'
import Maintenance from './pages/Maintenance.jsx'
import Admin from './pages/Admin.jsx'
import Resources from './pages/Resources.jsx'

export default function App() {
  return (
    <div>
      <div className="container">
        <TopBar />
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <RequireAuth><Home /></RequireAuth>
        } />

        <Route path="/pretrip" element={
          <RequireAuth><Checklist templateKey="daily_pretrip" /></RequireAuth>
        } />

        <Route path="/cleaning" element={
          <RequireAuth><Checklist templateKey="cleaning" /></RequireAuth>
        } />

        <Route path="/monthly-review" element={
          <RequireAuth><Checklist templateKey="monthly_ops_review" isMonthly /></RequireAuth>
        } />

        <Route path="/incident" element={
          <RequireAuth><Incident /></RequireAuth>
        } />

        <Route path="/maintenance" element={
          <RequireAuth><Maintenance /></RequireAuth>
        } />

        <Route path="/resources" element={
          <RequireAuth><Resources /></RequireAuth>
        } />

        <Route path="/admin" element={
          <RequireAuth>
            <RequireAdmin><Admin /></RequireAdmin>
          </RequireAuth>
        } />
      </Routes>
    </div>
  )
}
