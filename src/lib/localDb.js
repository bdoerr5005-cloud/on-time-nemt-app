// Local (no-Firebase) demo datastore.
// Persists submissions in localStorage so the app works with zero setup.

const SUBMISSIONS_KEY = 'otn_demo_submissions_v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]')
  } catch {
    return []
  }
}

function save(items) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items))
}

export function addSubmission(type, payload, user) {
  const items = load()
  items.unshift({
    id: 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36),
    type,
    payload,
    user: user ? { uid: user.uid, email: user.email } : null,
    createdAt: new Date().toISOString(),
  })
  save(items)
  return items[0]
}

export function listSubmissions({ limit = 200 } = {}) {
  return load().slice(0, limit)
}
