import React, { useState } from 'react'
import { addSubmission } from '../lib/localDb'
import { useAuth } from '../hooks/useAuth'

export default function Maintenance() {
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState('')
  const [vin, setVin] = useState('')
  const [mileage, setMileage] = useState('')
  const [service, setService] = useState('')
  const [vendor, setVendor] = useState('')
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    setErr('')
    setBusy(true)
    try {
      const payload = {
        type: 'maintenance',
        userId: user.uid,
        userEmail: user.email,
        vehicle: vehicle.trim(),
        vin: vin.trim(),
        mileage: mileage ? Number(mileage) : null,
        service: service.trim(),
        vendor: vendor.trim(),
        notes: notes.trim(),
        photoName: photo ? photo.name : null,
        createdAt: new Date().toISOString()
      }

      addSubmission('maintenance', payload, user)
      setDone(true)
    } catch (ex) {
      setErr(ex?.message || 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Maintenance Note / Log</h2>
        <div className="small">Use this for any issue found or service completed. Time-stamped for preventative maintenance tracking.</div>
        <hr/>

        {done ? (
          <div className="card" style={{background:'rgba(47,225,143,0.12)', borderColor:'rgba(47,225,143,0.35)'}}>
            <h3>Saved ✅</h3>
            <div className="small">It will appear in the Admin Dashboard for tracking.</div>
          </div>
        ) : (
          <>
            <div className="grid">
              <div>
                <label>Vehicle #</label>
                <input className="input" value={vehicle} onChange={(e)=>setVehicle(e.target.value)} placeholder="e.g., 01" />
              </div>
              <div>
                <label>VIN (optional)</label>
                <input className="input" value={vin} onChange={(e)=>setVin(e.target.value)} />
              </div>
              <div>
                <label>Mileage</label>
                <input className="input" value={mileage} onChange={(e)=>setMileage(e.target.value)} inputMode="numeric" placeholder="e.g., 43120" />
              </div>
            </div>

            <label>Service / Issue</label>
            <input className="input" value={service} onChange={(e)=>setService(e.target.value)} placeholder="e.g., Oil change / Tie-down strap frayed" />

            <div className="grid">
              <div>
                <label>Vendor/Tech (optional)</label>
                <input className="input" value={vendor} onChange={(e)=>setVendor(e.target.value)} placeholder="Shop name or technician" />
              </div>
              <div>
                <label>Photo (recommended)</label>
                <input className="input" type="file" accept="image/*" onChange={(e)=>setPhoto(e.target.files?.[0] || null)} />
              </div>
            </div>

            <label>Notes</label>
            <textarea className="input" rows={4} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Next due, parts needed, downtime risk, etc." />

            {err && <div className="small" style={{color:'var(--danger)', marginTop: 10}}>{err}</div>}

            <div className="row" style={{marginTop: 12}}>
              <button className="btn primary" disabled={busy || !service.trim()} onClick={submit}>
                {busy ? 'Saving…' : 'Submit'}
              </button>
              <div className="small">Offline supported; uploads sync later.</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
