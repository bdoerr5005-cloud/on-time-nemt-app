export function nowIso() {
  return new Date().toISOString()
}

export function formatDateTime(ts) {
  try {
    const d = (ts?.toDate?.() ? ts.toDate() : (ts ? new Date(ts) : null))
    if (!d) return ""
    return d.toLocaleString()
  } catch {
    return ""
  }
}

export function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function toCsv(rows) {
  const escape = (v) => {
    const s = String(v ?? "")
    if (/[",\n]/.test(s)) return '"' + s.replaceAll('"', '""') + '"'
    return s
  }
  const headers = Object.keys(rows[0] || {})
  const lines = [headers.map(escape).join(",")]
  for (const r of rows) lines.push(headers.map(h => escape(r[h])).join(","))
  return lines.join("\n")
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
