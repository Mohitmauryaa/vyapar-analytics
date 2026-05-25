import React, { useState } from 'react'
import { supabase } from '../services/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Wrong email or password. Try again.')
      setLoading(false)
    } else {
      onLogin()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Helvetica Neue, sans-serif' }}>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: '40px 48px', width: 380 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Vyapar Analytics</div>
          <div style={{ fontSize: 13, color: '#999' }}>Sign in to your dashboard</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Email</div>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              style={{ width: '100%', border: '1px solid #eee', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Password</div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', border: '1px solid #eee', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && <div style={{ background: '#FFE5E7', color: '#C1121F', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#1A1916', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}