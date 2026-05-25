import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { supabase } from '../services/supabase'

const navItems = [
  const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/marketplaces', label: 'Marketplace Analytics', icon: '🏪' },
  { path: '/products', label: 'Products', icon: '👗' },
  { path: '/settlements', label: 'Settlements', icon: '💰' },
]

export default function Layout({ session }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Helvetica Neue, sans-serif', background: '#FAF9F6' }}>
      <div style={{ width: isOpen ? 220 : 60, background: '#fff', borderRight: '1px solid #eee', transition: 'width .2s', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
          {isOpen && <div style={{ fontSize: 16, fontWeight: 500 }}>Vyapar Analytics</div>}
          {isOpen && <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>Business Dashboard</div>}
        </div>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              textDecoration: 'none', fontSize: 13, color: isActive ? '#fff' : '#666',
              background: isActive ? '#1A1916' : 'transparent', margin: '2px 8px', borderRadius: 8
            })}>
            <span>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid #f0f0f0' }}>
          {isOpen && <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{session?.user?.email}</div>}
          <button onClick={() => supabase.auth.signOut()}
            style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#666', width: '100%', marginBottom: 8 }}>
            {isOpen ? 'Sign Out' : '↩'}
          </button>
          <button onClick={() => setIsOpen(!isOpen)}
            style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: '#666', width: '100%' }}>
            {isOpen ? '← Collapse' : '→'}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  )
}