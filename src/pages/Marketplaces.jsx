import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MARKETPLACES = ['Amazon','Flipkart','Meesho','Myntra','Ajio','Shopify','Wholesale']
const MP_COLORS = { Amazon:'#FF9900', Flipkart:'#2874F0', Meesho:'#9B2335', Myntra:'#FF3F6C', Ajio:'#8B9B00', Shopify:'#96BF48', Wholesale:'#888780' }

const fmt = v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`

export default function Marketplaces() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMP, setSelectedMP] = useState('All')
  const [selectedYear, setSelectedYear] = useState(2025)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [newRow, setNewRow] = useState({ marketplace:'Amazon', month:'January', year:2025, total_sales:0, total_orders:0, net_profit:0, total_returns:0, net_settlement:0, product_cost:0 })
  const [activeTab, setActiveTab] = useState('table')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data } = await supabase.from('marketplace_monthly').select('*').order('year').order('month')
    setData(data || [])
    setLoading(false)
  }

  async function saveEdit(id) {
    await supabase.from('marketplace_monthly').update(editForm).eq('id', id)
    setEditingId(null)
    fetchData()
  }

  async function deleteRow(id) {
    if (window.confirm('Delete this record?')) {
      await supabase.from('marketplace_monthly').delete().eq('id', id)
      fetchData()
    }
  }

  async function addRow() {
    await supabase.from('marketplace_monthly').insert([newRow])
    setAdding(false)
    setNewRow({ marketplace:'Amazon', month:'January', year:2025, total_sales:0, total_orders:0, net_profit:0, total_returns:0, net_settlement:0, product_cost:0 })
    fetchData()
  }

  const filtered = data.filter(d =>
    (selectedMP === 'All' || d.marketplace === selectedMP) &&
    d.year === selectedYear
  )

  const chartData = MONTHS.filter(m => filtered.some(d => d.month === m)).map(month => {
    const row = { month: month.slice(0,3) }
    const entries = filtered.filter(d => d.month === month)
    if (selectedMP === 'All') {
      row.total_sales = entries.reduce((a,b) => a + b.total_sales, 0)
      row.net_profit = entries.reduce((a,b) => a + b.net_profit, 0)
      row.total_orders = entries.reduce((a,b) => a + b.total_orders, 0)
      row.total_returns = entries.reduce((a,b) => a + b.total_returns, 0)
      row.net_settlement = entries.reduce((a,b) => a + b.net_settlement, 0)
      row.product_cost = entries.reduce((a,b) => a + b.product_cost, 0)
    } else {
      const e = entries[0] || {}
      row.total_sales = e.total_sales || 0
      row.net_profit = e.net_profit || 0
      row.total_orders = e.total_orders || 0
      row.total_returns = e.total_returns || 0
      row.net_settlement = e.net_settlement || 0
      row.product_cost = e.product_cost || 0
    }
    return row
  })

  const totalSales = filtered.reduce((a,b) => a + b.total_sales, 0)
  const totalOrders = filtered.reduce((a,b) => a + b.total_orders, 0)
  const totalProfit = filtered.reduce((a,b) => a + b.net_profit, 0)
  const totalReturns = filtered.reduce((a,b) => a + b.total_returns, 0)
  const totalSettlement = filtered.reduce((a,b) => a + b.net_settlement, 0)
  const totalCost = filtered.reduce((a,b) => a + b.product_cost, 0)

  const inputStyle = { border:'1px solid #ddd', borderRadius:6, padding:'4px 8px', fontSize:12, width:'100%', boxSizing:'border-box' }
  const tabStyle = active => ({ padding:'8px 18px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight: active ? 500 : 400, background: active ? '#1A1916' : 'transparent', color: active ? '#fff' : '#666', border:'none' })

  if (loading) return <div style={{ padding:40, color:'#999' }}>Loading...</div>

  return (
    <div style={{ padding:28, fontFamily:'Helvetica Neue, sans-serif' }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:400, marginBottom:4 }}>Marketplace Analytics</h2>
          <p style={{ color:'#888', fontSize:13 }}>Monthly data across all platforms · {data.length} records</p>
        </div>
        <button onClick={() => setAdding(true)} style={{ background:'#1A1916', color:'#fff', border:'none', borderRadius:8, padding:'9px 18px', cursor:'pointer', fontSize:13 }}>
          + Add Data
        </button>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'#999', marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>Marketplace</div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {['All',...MARKETPLACES].map(mp => (
              <button key={mp} onClick={() => setSelectedMP(mp)}
                style={{ padding:'6px 12px', borderRadius:20, border:'1px solid #eee', cursor:'pointer', fontSize:12, background: selectedMP===mp ? '#1A1916' : '#fff', color: selectedMP===mp ? '#fff' : '#666' }}>
                {mp}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginLeft:'auto' }}>
          <div style={{ fontSize:11, color:'#999', marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>Year</div>
          <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}
            style={{ border:'1px solid #eee', borderRadius:8, padding:'7px 12px', fontSize:13, cursor:'pointer' }}>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px,1fr))', gap:12, marginBottom:24 }}>
        {[
          { label:'Total Sales', value:fmt(totalSales), color:'#1A1916' },
          { label:'Total Orders', value:totalOrders.toLocaleString(), color:'#1A1916' },
          { label:'Net Profit', value:fmt(totalProfit), color:'#2D6A4F' },
          { label:'Total Returns', value:totalReturns.toLocaleString(), color:'#C1121F' },
          { label:'Net Settlement', value:fmt(totalSettlement), color:'#1B4F8C' },
          { label:'Product Cost', value:fmt(totalCost), color:'#8B5E00' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontSize:10, color:'#999', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{kpi.label}</div>
            <div style={{ fontSize:20, fontWeight:500, color:kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:16, background:'#f5f5f0', padding:4, borderRadius:10, width:'fit-content' }}>
        <button style={tabStyle(activeTab==='table')} onClick={() => setActiveTab('table')}>Table View</button>
        <button style={tabStyle(activeTab==='sales')} onClick={() => setActiveTab('sales')}>Sales Chart</button>
        <button style={tabStyle(activeTab==='profit')} onClick={() => setActiveTab('profit')}>Profit Chart</button>
        <button style={tabStyle(activeTab==='orders')} onClick={() => setActiveTab('orders')}>Orders Chart</button>
      </div>

      {activeTab === 'sales' && (
        <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:20, marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:16 }}>Monthly Sales vs Product Cost</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend />
              <Bar dataKey="total_sales" name="Total Sales" fill="#1A1916" radius={[4,4,0,0]} />
              <Bar dataKey="product_cost" name="Product Cost" fill="#E5E2DA" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'profit' && (
        <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:20, marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:16 }}>Monthly Profit & Settlement Trend</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={v => fmt(v)} />
              <Legend />
              <Line type="monotone" dataKey="net_profit" name="Net Profit" stroke="#2D6A4F" strokeWidth={2} dot={{ r:4 }} />
              <Line type="monotone" dataKey="net_settlement" name="Net Settlement" stroke="#1B4F8C" strokeWidth={2} dot={{ r:4 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:20, marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:16 }}>Monthly Orders & Returns</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_orders" name="Orders" fill="#1B4F8C" radius={[4,4,0,0]} />
              <Bar dataKey="total_returns" name="Returns" fill="#FFB3B3" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'table' && (
        <>
          {adding && (
            <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:20, marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:12 }}>Add New Monthly Data</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:10 }}>
                <div>
                  <div style={{ fontSize:11, color:'#999', marginBottom:4 }}>MARKETPLACE</div>
                  <select style={inputStyle} value={newRow.marketplace} onChange={e => setNewRow({...newRow, marketplace:e.target.value})}>
                    {MARKETPLACES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#999', marginBottom:4 }}>MONTH</div>
                  <select style={inputStyle} value={newRow.month} onChange={e => setNewRow({...newRow, month:e.target.value})}>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#999', marginBottom:4 }}>YEAR</div>
                  <input style={inputStyle} type="number" value={newRow.year} onChange={e => setNewRow({...newRow, year:+e.target.value})} />
                </div>
                {['total_sales','total_orders','net_profit','total_returns','net_settlement','product_cost'].map(field => (
                  <div key={field}>
                    <div style={{ fontSize:11, color:'#999', marginBottom:4 }}>{field.replace(/_/g,' ').toUpperCase()}</div>
                    <input style={inputStyle} type="number" value={newRow[field]} onChange={e => setNewRow({...newRow, [field]:+e.target.value})} />
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button onClick={addRow} style={{ background:'#1A1916', color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:12 }}>Save</button>
                <button onClick={() => setAdding(false)} style={{ background:'none', border:'1px solid #eee', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:12 }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid #f0f0f0' }}>
                  {['Marketplace','Month','Year','Total Sales','Total Orders','Net Profit','Total Returns','Net Settlement','Product Cost',''].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'10px 14px', fontSize:10, color:'#999', fontWeight:500, textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.sort((a,b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month)).map(row => (
                  <tr key={row.id} style={{ borderBottom:'1px solid #fafafa' }}>
                    {editingId === row.id ? (
                      <>
                        <td style={{ padding:'6px 8px' }}>
                          <select style={inputStyle} value={editForm.marketplace} onChange={e => setEditForm({...editForm, marketplace:e.target.value})}>
                            {MARKETPLACES.map(m => <option key={m}>{m}</option>)}
                          </select>
                        </td>
                        <td style={{ padding:'6px 8px' }}>
                          <select style={inputStyle} value={editForm.month} onChange={e => setEditForm({...editForm, month:e.target.value})}>
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                          </select>
                        </td>
                        <td style={{ padding:'6px 8px' }}>
                          <input style={inputStyle} type="number" value={editForm.year} onChange={e => setEditForm({...editForm, year:+e.target.value})} />
                        </td>
                        {['total_sales','total_orders','net_profit','total_returns','net_settlement','product_cost'].map(field => (
                          <td key={field} style={{ padding:'6px 8px' }}>
                            <input style={inputStyle} type="number" value={editForm[field]} onChange={e => setEditForm({...editForm, [field]:+e.target.value})} />
                          </td>
                        ))}
                        <td style={{ padding:'6px 8px', whiteSpace:'nowrap' }}>
                          <button onClick={() => saveEdit(row.id)} style={{ background:'#2D6A4F', color:'#fff', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:11, marginRight:4 }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={{ background:'none', border:'1px solid #ddd', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:11 }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:8, height:8, borderRadius:'50%', background:MP_COLORS[row.marketplace] || '#888', flexShrink:0 }}></div>
                            <span style={{ fontWeight:500 }}>{row.marketplace}</span>
                          </div>
                        </td>
                        <td style={{ padding:'10px 14px' }}>{row.month}</td>
                        <td style={{ padding:'10px 14px', color:'#999' }}>{row.year}</td>
                        <td style={{ padding:'10px 14px', fontWeight:500 }}>{fmt(row.total_sales)}</td>
                        <td style={{ padding:'10px 14px' }}>{row.total_orders?.toLocaleString()}</td>
                        <td style={{ padding:'10px 14px', color:'#2D6A4F', fontWeight:500 }}>{fmt(row.net_profit)}</td>
                        <td style={{ padding:'10px 14px' }}>
                          <span style={{ background:'#FFE5E7', color:'#C1121F', padding:'2px 8px', borderRadius:20, fontSize:11 }}>{row.total_returns}</span>
                        </td>
                        <td style={{ padding:'10px 14px', color:'#1B4F8C' }}>{fmt(row.net_settlement)}</td>
                        <td style={{ padding:'10px 14px', color:'#8B5E00' }}>{fmt(row.product_cost)}</td>
                        <td style={{ padding:'10px 14px', whiteSpace:'nowrap' }}>
                          <button onClick={() => { setEditingId(row.id); setEditForm(row) }} style={{ background:'none', border:'1px solid #ddd', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:11, marginRight:4 }}>Edit</button>
                          <button onClick={() => deleteRow(row.id)} style={{ background:'none', border:'1px solid #FFE5E7', color:'#C1121F', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:11 }}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}