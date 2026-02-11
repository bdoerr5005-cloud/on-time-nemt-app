// Local (no-Firebase) demo auth.
// Stores users + session in localStorage so the app can run with zero setup.

const USERS_KEY = 'otn_demo_users_v1'
const SESSION_KEY = 'otn_demo_session_v1'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Minimal user shape compatible with the existing UI
function toUser(u) {
  if (!u) return null
  return {
    uid: u.uid,
    email: u.email,
  }
}

export function getCurrentUser() {
  const sess = loadSession()
  return toUser(sess)
}

export function onAuthStateChanged(_unusedAuth, cb) {
  // Fire immediately
  cb(getCurrentUser())

  // Notify on storage changes (multi-tab)
  const handler = (e) => {
    if (e.key === SESSION_KEY) cb(getCurrentUser())
  }
  window.addEventListener('storage', handler)

  // Provide an unsubscribe fn like Firebase
  return () => window.removeEventListener('storage', handler)
}

export async function createUserWithEmailAndPassword(_unusedAuth, email, password) {
  const e = String(email || '').trim().toLowerCase()
  if (!e) throw new Error('Email is required')
  if (!password || String(password).length < 6) throw new Error('Password must be at least 6 characters')

  const users = loadUsers()
  if (users.some(u => u.email === e)) throw new Error('Account already exists for that email')

  const uid = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
  users.push({ uid, email: e, password: String(password) })
  saveUsers(users)
  saveSession({ uid, email: e })

  return { user: { uid, email: e } }
}

export async function signInWithEmailAndPassword(_unusedAuth, email, password) {
  const e = String(email || '').trim().toLowerCase()
  const users = loadUsers()
  const match = users.find(u => u.email === e)
  if (!match || match.password !== String(password)) throw new Error('Invalid email or password')

  saveSession({ uid: match.uid, email: match.email })
  return { user: { uid: match.uid, email: match.email } }
}

export async function signOut(_unusedAuth) {
  clearSession()
}
