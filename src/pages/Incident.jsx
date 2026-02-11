import React, { useState } from 'react'
import { addSubmission } from '../lib/localDb'
import { useAuth } from '../hooks/useAuth'

const INCIDENT_TYPES = [
  'Passenger injury',
  'Vehicle accident',
  'Property damage',
  'Behavioral incident',
  'Medical emergency',
  'Other'
]

export default function Incident() {
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState('')
  const [tripId, setTripId] = useState('')
  const [type, setType] = useState(INCIDENT_TYPES[0])
  const [otherType, setOtherType] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [actions, setActions] = useState({ _911:false, supervisor:false, broker:false, firstAid:false, photos:false })
  const [photo, setPhoto] = useState(null)
  const [voice, setVoice] = useState(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    setErr('')
    setBusy(true)
    try {
      const payload = {
        type: 'incident',
        userId: user.uid,
        userEmail: user.email,
        vehicle: vehicle.trim(),
        tripId: tripId.trim(),
        incidentType: type === 'Other' ? (otherType.trim() || 'Other') : type,
        location: location.trim(),
        description: description.trim(),
        actionsTaken: {
          call911: actions._911,
          supervisorNotified: actions.supervisor,
          brokerNotified: actions.broker,
          firstAid: actions.firstAid,
          photosCompleted: actions.photos
        },
        photoName: photo ? photo.name : null,
        voiceName: voice ? voice.name : null,
        createdAt: new Date().toISOString()
      }

      addSubmission('incident', payload, user)
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
        <h2>Incident / Accident Report</h2>
        <div className="small">Keep it factual only. Time-stamped and stored for compliance.</div>
        <hr/>

        {done ? (
          <div className="card" style={{background:'rgba(47,225,143,0.12)', borderColor:'rgba(47,225,143,0.35)'}}>
            <h3>Saved ✅</h3>
            <div className="small">Supervisor can review in the Admin Dashboard.</div>
          </div>
        ) : (
          <>
            <div className="grid">
              <div>
                <label>Vehicle #</label>
                <input className="input" value={vehicle} onChange={(e)=>setVehicle(e.target.value)} placeholder="e.g., 01" />
              </div>
              <div>
                <label>Trip ID (optional)</label>
                <input className="input" value={tripId} onChange={(e)=>setTripId(e.target.value)} placeholder="If dispatch system provides one" />
              </div>
            </div>

            <label>Type</label>
            <select className="input" value={type} onChange={(e)=>setType(e.target.value)}>
              {INCIDENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {type === 'Other' && (
              <>
                <label>Other (specify)</label>
                <input className="input" value={otherType} onChange={(e)=>setOtherType(e.target.value)} />
              </>
            )}

            <label>Location</label>
            <input className="input" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Address / facility name / cross streets" />

            <label>Description (factual only)</label>
            <textarea className="input" rows={5} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="What happened, in order. Avoid opinions." />

            <label>Actions Taken</label>
            <div className="grid">
              <div className="checkboxRow"><input type="checkbox" checked={actions._911} onChange={()=>setActions(p=>({...p,_911:!p._911}))} /><div><div style={{fontWeight:700}}>911 called</div></div></div>
              <div className="checkboxRow"><input type="checkbox" checked={actions.supervisor} onChange={()=>setActions(p=>({...p,supervisor:!p.supervisor}))} /><div><div style={{fontWeight:700}}>Supervisor notified</div></div></div>
              <div className="checkboxRow"><input type="checkbox" checked={actions.broker} onChange={()=>setActions(p=>({...p,broker:!p.broker}))} /><div><div style={{fontWeight:700}}>Broker notified</div></div></div>
              <div className="checkboxRow"><input type="checkbox" checked={actions.firstAid} onChange={()=>setActions(p=>({...p,firstAid:!p.firstAid}))} /><div><div style={{fontWeight:700}}>First aid provided</div></div></div>
              <div className="checkboxRow"><input type="checkbox" checked={actions.photos} onChange={()=>setActions(p=>({...p,photos:!p.photos}))} /><div><div style={{fontWeight:700}}>Photos/documentation completed</div></div></div>
            </div>

            <hr/>
            <div className="grid">
              <div>
                <label>Photo (recommended)</label>
                <input className="input" type="file" accept="image/*" onChange={(e)=>setPhoto(e.target.files?.[0] || null)} />
              </div>
              <div>
                <label>Voice note (optional)</label>
                <input className="input" type="file" accept="audio/*" onChange={(e)=>setVoice(e.target.files?.[0] || null)} />
              </div>
            </div>

            {err && <div className="small" style={{color:'var(--danger)', marginTop: 10}}>{err}</div>}

            <div className="row" style={{marginTop: 12}}>
              <button className="btn danger" disabled={busy || !description.trim()} onClick={submit}>
                {busy ? 'Saving…' : 'Submit Incident'}
              </button>
              <div className="small">Works offline; uploads sync when back online.</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
