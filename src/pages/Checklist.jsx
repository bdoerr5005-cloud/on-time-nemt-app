import React, { useMemo, useState } from 'react'
import { addSubmission } from '../lib/localDb'
import { useAuth } from '../hooks/useAuth'
import { TEMPLATES } from '../lib/checklists'

// Status values for each checklist item
const STATUS = {
  OK: 'ok',
  ISSUE: 'issue',
  FAIL: 'fail'
}

function statusLabel(s) {
  if (s === STATUS.OK) return 'OK'
  if (s === STATUS.ISSUE) return 'Issue'
  if (s === STATUS.FAIL) return 'Fail'
  return '—'
}

export default function Checklist({ templateKey, isMonthly }) {
  const { user } = useAuth()
  const tpl = TEMPLATES[templateKey]

  const allItems = useMemo(() => {
    const map = []
    tpl.sections.forEach((s, si) => s.items.forEach((it, ii) => map.push({ si, ii, label: it, section: s.title })))
    return map
  }, [templateKey])

  const [vehicle, setVehicle] = useState('')
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState(null)
  const [finalCert, setFinalCert] = useState(false)
  const [statuses, setStatuses] = useState(() => Object.fromEntries(allItems.map((_, idx) => [idx, null])))
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  const totalCount = allItems.length
  const completedCount = Object.values(statuses).filter(Boolean).length
  const allRated = completedCount === totalCount && totalCount > 0

  const anyIssue = Object.values(statuses).some(s => s === STATUS.ISSUE)
  const anyFail = Object.values(statuses).some(s => s === STATUS.FAIL)

  const criticalSet = new Set((tpl.criticalItems || []).map(String))
  const criticalNotOk = allItems
    .map((it, idx) => ({ it, idx, s: statuses[idx] }))
    .filter(x => criticalSet.has(x.it.label) && x.s && x.s !== STATUS.OK)

  const needsNotes = anyIssue || anyFail || criticalNotOk.length > 0
  const notesOk = !needsNotes || notes.trim().length >= 5

  const certRequired = !!tpl.requireFinalCertification
  const certOk = !certRequired || finalCert

  // Hard-stop rule:
  // - Any FAIL blocks submit
  // - Any "critical" item that is not OK also blocks submit
  const hardStop = anyFail || criticalNotOk.length > 0

  const canSubmit = allRated && notesOk && certOk && !hardStop && !busy

  function setItem(idx, next) {
    setStatuses(prev => ({ ...prev, [idx]: next }))
  }

  async function submit() {
    setErr('')
    setBusy(true)
    try {
      const createdAt = new Date().toISOString()
      const payload = {
        type: 'checklist',
        templateKey,
        templateTitle: tpl.title,
        isMonthly: !!isMonthly,
        userId: user.uid,
        userEmail: user.email,
        vehicle: vehicle.trim(),
        // Store item statuses (OK / Issue / Fail)
        items: allItems.map((x, idx) => ({
          section: x.section,
          label: x.label,
          status: statuses[idx]
        })),
        finalCertification: certRequired ? !!finalCert : null,
        notes: notes.trim(),
        photoName: photo ? photo.name : null,
        createdAt
      }

      addSubmission('checklist', payload, user)

      // For pre-trip, automatically create a maintenance note when anything isn't OK.
      if (templateKey === 'daily_pretrip' && anyIssue) {
        const problemLines = allItems
          .map((x, idx) => ({ ...x, status: statuses[idx] }))
          .filter((x) => x.status !== STATUS.OK)
          .map((x) => `- ${x.label}: ${x.status === STATUS.FAIL ? 'FAIL' : 'ISSUE'}`)
          .join('\n')

        addSubmission(
          'maintenance',
          {
            type: 'maintenance',
            vehicle: vehicle.trim(),
            vin: '',
            mileage: '',
            serviceIssue: `Pre-trip items not OK (auto-created)`
              .trim(),
            vendorTech: '',
            notes: `Auto-created from daily pre-trip.\n\n${problemLines}\n\nDriver notes: ${notes.trim()}`
              .trim(),
            photoName: photo ? photo.name : null,
            linkedChecklistId: payload.id,
            createdAt
          },
          user
        )
      }
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
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <h2 style={{ marginBottom: 6 }}>{tpl.title}</h2>
            {tpl.subtitle && <div className="small">{tpl.subtitle}</div>}
          </div>
          <div className="kpi">
            <div className="num">{completedCount}/{totalCount}</div>
            <div className="lbl">rated</div>
          </div>
        </div>

        {done ? (
          <div className="card" style={{ background: 'rgba(47,225,143,0.12)', borderColor: 'rgba(47,225,143,0.35)' }}>
            <h3>Saved ✅</h3>
            <div className="small">Your submission is stored and time-stamped.</div>
          </div>
        ) : (
          <>
            <div className="grid">
              <div>
                <label>Vehicle #</label>
                <input
                  className="input"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g., 01"
                />
              </div>
              <div>
                <label>Optional photo (recommended if issues found)</label>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
                <div className="small">Optional. Only attach if you found something worth documenting.</div>
              </div>
            </div>

            {(hardStop || needsNotes) && (
              <div
                className="card"
                style={{
                  marginTop: 12,
                  background: hardStop ? 'rgba(255,59,59,0.10)' : 'rgba(255,176,0,0.10)',
                  borderColor: hardStop ? 'rgba(255,59,59,0.35)' : 'rgba(255,176,0,0.35)'
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {hardStop ? 'LOCK SAFETY ITEMS — Do not operate until resolved' : 'Documentation required'}
                </div>
                {criticalNotOk.length > 0 && (
                  <div className="small" style={{ marginBottom: 8 }}>
                    These items are marked as critical and must be OK before the first trip:
                    <ul style={{ marginTop: 6 }}>
                      {criticalNotOk.map((x) => (
                        <li key={x.idx}><b>{x.it.label}</b> — {statusLabel(x.s)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {needsNotes && (
                  <div className="small">
                    Add a short note describing what you found and what you did (or who you notified).
                  </div>
                )}
              </div>
            )}

            <hr />

            {tpl.sections.map((sec, si) => (
              <div key={si} style={{ marginBottom: 14 }}>
                <div className="badge">{sec.title}</div>
                <div className="list" style={{ marginTop: 8 }}>
                  {sec.items.map((label, ii) => {
                    const idx = allItems.findIndex(x => x.si === si && x.ii === ii)
                    const s = statuses[idx]
                    const isCritical = criticalSet.has(label)
                    return (
                      <div className="row" key={ii} style={{ gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800 }}>{label}{isCritical ? <span className="small" style={{ marginLeft: 8, color: 'rgba(255,176,0,0.95)' }}>LOCK</span> : null}</div>
                          <div className="small">Pick one: OK / Issue / Fail</div>
                        </div>

                        <div className="row" style={{ gap: 8 }}>
                          <button
                            className={"chip " + (s === STATUS.OK ? 'on' : '')}
                            onClick={() => setItem(idx, STATUS.OK)}
                            type="button"
                          >
                            OK
                          </button>
                          <button
                            className={"chip " + (s === STATUS.ISSUE ? 'warn' : '')}
                            onClick={() => setItem(idx, STATUS.ISSUE)}
                            type="button"
                          >
                            Issue
                          </button>
                          <button
                            className={"chip " + (s === STATUS.FAIL ? 'danger' : '')}
                            onClick={() => setItem(idx, STATUS.FAIL)}
                            type="button"
                          >
                            Fail
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <label>Notes (required if anything is Issue/Fail or a LOCK item is not OK)</label>
            <textarea
              className="input"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: 'Ramp slow to deploy; reported to MobilityWorks. No trips taken until cleared.'"
            />
            {!notesOk && <div className="small" style={{ color: 'var(--danger)', marginTop: 8 }}>Please add a short note (at least a sentence).</div>}

            {certRequired && (
              <div className="checkboxRow" style={{ marginTop: 12 }}>
                <input type="checkbox" checked={finalCert} onChange={(e) => setFinalCert(e.target.checked)} />
                <div>
                  <div style={{ fontWeight: 800 }}>Final certification</div>
                  <div className="small">I confirm this vehicle is safe and ready for service.</div>
                </div>
              </div>
            )}

            {hardStop && (
              <div className="small" style={{ color: 'var(--danger)', marginTop: 10 }}>
                Submit is disabled because at least one LOCK item is not OK or an item is marked FAIL.
                Fix it and re-check, or stop operations.
              </div>
            )}

            {err && <div className="small" style={{ color: 'var(--danger)', marginTop: 10 }}>{err}</div>}

            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn primary" disabled={!canSubmit} onClick={submit}>
                {busy ? 'Saving…' : 'Submit'}
              </button>
              <div className="small">
                You can submit once every item is rated.
                <br />
                LOCK items must be OK.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
