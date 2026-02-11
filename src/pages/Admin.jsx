import React, { useEffect, useMemo, useState } from 'react'
import { listSubmissions } from '../lib/localDb'
import { formatDateTime, downloadCsv, toCsv, downloadJson } from '../lib/utils'

export default function Admin() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [max, setMax] = useState(200)

  useEffect(() => {
    setErr('')
    try {
      setRows(listSubmissions({ limit: Number(max) }))
      const t = setInterval(() => setRows(listSubmissions({ limit: Number(max) })), 1500)
      return () => clearInterval(t)
    } catch (e) {
      setErr(e?.message || 'Failed to load')
    }
  }, [max])

  const kpis = useMemo(() => {
    const out = { checklists: 0, incidents: 0, maintenance: 0 }
    rows.forEach(r => {
      if (r.type === 'checklist') out.checklists++
      if (r.type === 'incident') out.incidents++
      if (r.type === 'maintenance') out.maintenance++
    })
    return out
  }, [rows])

  function exportCsv() {
    const flat = rows.map(r => ({
      createdAt: formatDateTime(r.createdAt),
      type: r.type,
      templateTitle: r.templateTitle || '',
      isMonthly: r.isMonthly ? 'Y' : '',
      userEmail: r.userEmail || '',
      vehicle: r.vehicle || '',
      tripId: r.tripId || '',
      incidentType: r.incidentType || '',
      service: r.service || '',
      mileage: r.mileage ?? '',
      notes: (r.notes || r.description || '').slice(0, 500),
      photoUrl: r.photoUrl || '',
      voiceUrl: r.voiceUrl || ''
    }))
    const csv = toCsv(flat)
    downloadCsv(`on-time-nemt-submissions.csv`, csv)
  }

  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h2>Admin Dashboard</h2>
          <div className="small">Latest submissions (time-stamped). Export for your Ops Binder backup.</div>
          <hr />
          <div className="row">
            <div className="kpi"><div className="num">{kpis.checklists}</div><div className="lbl">checklists</div></div>
            <div className="kpi"><div className="num">{kpis.incidents}</div><div className="lbl">incidents</div></div>
            <div className="kpi"><div className="num">{kpis.maintenance}</div><div className="lbl">maintenance</div></div>
          </div>
          <hr />
          <label>Show last N submissions</label>
          <select className="input" value={max} onChange={(e)=>setMax(e.target.value)}>
            {[50,100,200,500,1000].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <div className="row" style={{marginTop: 12}}>
            <button className="btn primary" onClick={exportCsv}>Export CSV</button>
            <button className="btn" onClick={()=>downloadJson('on-time-nemt-submissions.json', rows)}>Export JSON</button>
          </div>
          {err && <div className="small" style={{color:'var(--danger)', marginTop: 10}}>{err}</div>}
        </div>

        <div className="card">
          <h3>Admin access (demo mode)</h3>
          <div className="small">
            In this no-setup demo, Admin is automatically granted to <b>bdoerr5005@gmail.com</b>.
            <br />
            When you're ready, we can switch this app to real Firebase users + secure admin roles.
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: 12}}>
        <h3>Recent submissions</h3>
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{formatDateTime(r.createdAt)}</td>
                  <td>{r.type}{r.isMonthly ? ' (Monthly)' : ''}</td>
                  <td>{r.userEmail || ''}</td>
                  <td>{r.vehicle || ''}</td>
                  <td>
                    {r.type === 'checklist' ? (r.templateTitle || '') : ''}
                    {r.type === 'incident' ? (r.incidentType || '') : ''}
                    {r.type === 'maintenance' ? (r.service || '') : ''}
                    {(r.notes || r.description) ? ` — ${(r.notes || r.description).slice(0, 120)}` : ''}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan="5" className="small">No submissions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
