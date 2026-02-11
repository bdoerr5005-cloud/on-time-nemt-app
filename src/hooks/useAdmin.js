import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { isAdminByUser } from '../lib/roles'

export function useAdmin() {
  const { user } = useAuth()
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const ok = await isAdminByUser(user)
      if (alive) {
        setAdmin(ok)
        setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [user?.uid])

  return { admin, loading }
}
