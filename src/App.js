import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './services/supabase'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import Marketplaces from './pages/Marketplaces'
import Products from './pages/Products'
import Settlements from './pages/Settlements'
import Login from './pages/Login'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Helvetica Neue, sans-serif', color: '#999' }}>
      Loading...
    </div>
  )

  if (!session) return <Login onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout session={session} />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="marketplaces" element={<Marketplaces />} />
          <Route path="settlements" element={<Settlements />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}