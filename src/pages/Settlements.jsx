import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function Settlements() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('settlements').select('*').order('created_at').then(({ data }) => {
      setData(data || [])
      setLoading(false)
    })
  }, [])

  const statusColor = { on_time: '#2D6A4F', settled: '#2D6A4F', delayed: '#8B5E00', at_risk: '#C1121F', processing: '#1B4F8C' }
  const statusBg = { on_time: '#D8F3DC', settled: '#D8F3DC', delayed: '#FFF3CD', at_risk: '#FFE5E7', processing: '#DBE9FF' }

  if (loading) return <div style={{ padding: 40, color: '#999' }}>Loading...</div>

  const totalPending = data.reduce((a, b) => a + b.amount_pending, 0)
  const totalReceived = data.reduce((a, b) => a + b.amount_received, 0)

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 4 }}>Settlements</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>Live reconciliation from Supabase</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '16px 20px', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Total Received</div>
          <div style={{ fontSize: 22, fontWeight: 500 }}>₹{(totalReceived/100000).toFixed(1)}L</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '16px 20px', flex: 1 }}>
          <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Total Pending</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#C1121F' }}>₹{(totalPending/1000).toFixed(0)}K</div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Marketplace','Pending','Received','Settlement Date','Status','Invoice'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #fafafa' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{s.marketplace}</td>
                <td style={{ padding: '12px 16px', color: s.amount_pending > 0 ? '#C1121F' : '#2D6A4F' }}>₹{(s.amount_pending/1000).toFixed(0)}K</td>
                <td style={{ padding: '12px 16px' }}>₹{(s.amount_received/1000).toFixed(0)}K</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{s.settlement_date}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: statusBg[s.status] || '#f0f0f0', color: statusColor[s.status] || '#666', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, textTransform: 'capitalize' }}>{s.status?.replace('_',' ')}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#999', fontSize: 12 }}>{s.invoice_ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}