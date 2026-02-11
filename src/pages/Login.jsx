import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../lib/localAuth'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation()
  const next = loc.state?.from || '/'

  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      if (mode === 'signup') await createUserWithEmailAndPassword(null, email, pw)
      else await signInWithEmailAndPassword(null, email, pw)
      nav(next, { replace: true })
    } catch (ex) {
      setErr(ex?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth: 520, margin: '0 auto'}}>
        <h2>{mode === 'signup' ? 'Create account' : 'Sign in'}</h2>
        <div className="small">Tip: this demo uses local sign-in (no setup). Create a driver account, then sign in.</div>
        <hr />
        <form onSubmit={submit}>
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input className="input" type="password" value={pw} onChange={(e)=>setPw(e.target.value)} required minLength={6} />
          {err && <div className="small" style={{color:'var(--danger)', marginTop: 10}}>{err}</div>}
          <div className="row" style={{marginTop: 12}}>
            <button className="btn primary" disabled={busy} type="submit">
              {busy ? 'Working…' : (mode === 'signup' ? 'Create account' : 'Sign in')}
            </button>
            <button className="btn" type="button" onClick={()=>setMode(mode === 'signup' ? 'signin' : 'signup')}>
              {mode === 'signup' ? 'I already have an account' : 'Create a driver account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
