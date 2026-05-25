import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const KPI = ({ label, value, trend }) => (
  <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 11, color: trend?.startsWith('+') ? '#2D6A4F' : '#C1121F' }}>{trend}</div>
  </div>
)

const COLORS = ['#FF9900','#2874F0','#9B2335','#FF3F6C','#96BF48','#B5D334']

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [settlements, setSettlements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: p } = await supabase.from('products').select('*')
      const { data: s } = await supabase.from('settlements').select('*')
      setProducts(p || [])
      setSettlements(s || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalPending = settlements.reduce((a, b) => a + (b.amount_pending || 0), 0)
  const totalReceived = settlements.reduce((a, b) => a + (b.amount_received || 0), 0)
  const totalStock = products.reduce((a, b) => a + (b.stock || 0), 0)
  const outOfStock = products.filter(p => p.stock === 0).length

  const settlementChart = settlements.map(s => ({
    name: s.marketplace,
    pending: s.amount_pending / 1000,
    received: s.amount_received / 1000,
  }))

  const pieData = settlements.map(s => ({
    name: s.marketplace,
    value: s.amount_received
  }))

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>Loading your dashboard...</div>
  )

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 4 }}>Business Overview</h2>
        <p style={{ color: '#888', fontSize: 13 }}>Live data from Supabase · {products.length} products · {settlements.length} marketplaces</p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <KPI label="Total Received" value={`₹${(totalReceived/100000).toFixed(1)}L`} trend="+18.3% vs last month" />
        <KPI label="Pending Settlements" value={`₹${(totalPending/1000).toFixed(0)}K`} trend="-4.1% improving" />
        <KPI label="Total Products" value={products.length} trend="+2 this week" />
        <KPI label="Total Stock" value={totalStock} trend={`${outOfStock} out of stock`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Settlement by Marketplace (₹K)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={settlementChart}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `₹${v}K`} />
              <Bar dataKey="received" fill="#1A1916" radius={[4,4,0,0]} name="Received" />
              <Bar dataKey="pending" fill="#E5E2DA" radius={[4,4,0,0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Revenue Split</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => `₹${(v/1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Products</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Name','SKU','Marketplace','MRP','Cost','Stock','Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #fafafa' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '10px 12px', color: '#999', fontSize: 12 }}>{p.sku}</td>
                <td style={{ padding: '10px 12px' }}>{p.marketplace}</td>
                <td style={{ padding: '10px 12px' }}>₹{p.mrp}</td>
                <td style={{ padding: '10px 12px' }}>₹{p.cost}</td>
                <td style={{ padding: '10px 12px' }}>{p.stock}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ background: p.stock === 0 ? '#FFE5E7' : p.stock < 20 ? '#FFF3CD' : '#D8F3DC', color: p.stock === 0 ? '#C1121F' : p.stock < 20 ? '#8B5E00' : '#2D6A4F', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                    {p.stock === 0 ? 'Out of Stock' : p.stock < 20 ? `Low: ${p.stock}` : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}