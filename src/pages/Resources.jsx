import React, { useMemo, useState } from 'react'

const serviceStandardsText = `
## Driver Experience & Service Standards

**Mission:** Deliver reliable, on‑time transportation with dignity, safety, and genuine care.

### Values (what we stand for)
• People First
• On Time, Every Time
• Care in the Details
• Respect Always
• Safety With Support
• Professionalism With Heart

### Driver promise (3 commitments)
1. Arrive prepared and on time for every trip
2. Deliver safe, responsible transportation — **safety always comes before speed**
3. Create a respectful, familiar, personal experience every time

### Daily expectations
• Keep the vehicle clean and organized
• Present professional appearance
• Communicate clearly and respectfully with guests and facilities
• Follow safety protocols and secure mobility devices properly
• Protect on‑time performance (plan ahead, communicate delays early)
• Document trips accurately and report issues promptly

### How we show up
With patience. With professionalism. With genuine care. With reliability. With consistency. With pride.
`;

const wheelchairSecurement = `
## Wheelchair Securement (4‑Point + Occupant Restraint)

These steps apply to most manual and power wheelchairs.

### 1) Position the chair
1. Center the wheelchair in the securement area.
2. Chair should face forward unless the vehicle/manufacturer requires a different position.
3. Engage wheelchair brakes (manual chairs) and power off the chair (power chairs).

### 2) Front straps (first)
1. Attach the **front tie‑downs** to a solid frame point (never the wheels).
2. Straps should pull **down and forward** at an angle.
3. Tighten until the chair is stable.

### 3) Rear straps (second)
1. Attach the **rear tie‑downs** to a solid frame point.
2. Straps should pull **down and rearward**.
3. Tighten evenly. The chair should not roll or pivot.

### 4) Occupant restraint (always)
1. Place the lap belt **low across the pelvis**, not the stomach.
2. Shoulder belt crosses the chest and connects to the lap belt buckle.
3. Ensure belts are not twisted and are snug.

### 5) Final check
1. Push/pull the chair gently. It should not move.
2. Re-check strap hooks and tension.
3. Confirm rider comfort and circulation (nothing pinched).

### If anything is questionable
Stop and fix it before moving the vehicle.
`;

export default function Resources() {
  const [tab, setTab] = useState('standards')

  const content = useMemo(() => {
    if (tab === 'securement') return wheelchairSecurement
    return serviceStandardsText
  }, [tab])

  return (
    <div className="card">
      <div className="cardHeader">
        <h2>Resources</h2>
        <div className="small">Quick references for drivers and audits.</div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <button className={tab === 'standards' ? 'btn primary' : 'btn'} onClick={() => setTab('standards')}>
          Service Standards
        </button>
        <button className={tab === 'securement' ? 'btn primary' : 'btn'} onClick={() => setTab('securement')}>
          Wheelchair Securement
        </button>
        <a className="btn" href="/resources/On Time NEMT Driver Experience and Service Standards Guide.docx" target="_blank" rel="noreferrer">
          Download DOCX
        </a>
      </div>

      <div className="markdown">
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>
      </div>
    </div>
  )
}
