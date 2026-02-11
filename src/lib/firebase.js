import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * 1) Create a Firebase project (free tier is fine)
 * 2) Add a Web App to get your config
 * 3) Copy/paste config values below
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PASTE_ME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "PASTE_ME",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "PASTE_ME",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "PASTE_ME",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "PASTE_ME",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "PASTE_ME"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Offline support: checklists & drafts will work without signal and sync later.
enableIndexedDbPersistence(db).catch(() => {
  // If multiple tabs open, or unsupported, persistence may fail—safe to ignore for MVP.
})
