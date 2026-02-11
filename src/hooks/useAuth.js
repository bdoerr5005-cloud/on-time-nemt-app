import { useEffect, useState } from 'react'
import { onAuthStateChanged } from '../lib/localAuth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(null, (u) => {
      setUser(u || null)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { user, loading }
}
