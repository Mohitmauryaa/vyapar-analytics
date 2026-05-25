import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [newProduct, setNewProduct] = useState({ name:'', sku:'', category:'', marketplace:'Amazon', mrp:'', cost:'', stock:'' })

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  async function saveEdit(id) {
    await supabase.from('products').update(form).eq('id', id)
    setEditing(null)
    fetchProducts()
  }

  async function deleteProduct(id) {
    if (window.confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  async function addProduct() {
    await supabase.from('products').insert([newProduct])
    setAdding(false)
    setNewProduct({ name:'', sku:'', category:'', marketplace:'Amazon', mrp:'', cost:'', stock:'' })
    fetchProducts()
  }

  if (loading) return <div style={{ padding: 40, color: '#999' }}>Loading...</div>

  const inputStyle = { border: '1px solid #ddd', borderRadius: 6, padding: '4px 8px', fontSize: 12, width: '100%' }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 4 }}>Products</h2>
          <p style={{ color: '#888', fontSize: 13 }}>{products.length} products · click any row to edit</p>
        </div>
        <button onClick={() => setAdding(true)} style={{ background: '#1A1916', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontSize: 13 }}>
          + Add Product
        </button>
      </div>

      {adding && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>New Product</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {['name','sku','category','marketplace','mrp','cost','stock'].map(field => (
              <div key={field}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 4, textTransform: 'uppercase' }}>{field}</div>
                <input style={inputStyle} value={newProduct[field]} onChange={e => setNewProduct({...newProduct, [field]: e.target.value})} placeholder={field} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={addProduct} style={{ background: '#1A1916', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12 }}>Save</button>
            <button onClick={() => setAdding(false)} style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              {['Name','SKU','Category','Marketplace','MRP','Cost','Stock','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, color: '#999', fontWeight: 500, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #fafafa' }}>
                {editing === p.id ? (
                  <>
                    {['name','sku','category','marketplace','mrp','cost','stock'].map(field => (
                      <td key={field} style={{ padding: '6px 8px' }}>
                        <input style={inputStyle} value={form[field] ?? p[field]} onChange={e => setForm({...form, [field]: e.target.value})} />
                      </td>
                    ))}
                    <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>
                      <button onClick={() => saveEdit(p.id)} style={{ background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, marginRight: 4 }}>Save</button>
                      <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '10px 14px', color: '#999', fontSize: 12 }}>{p.sku}</td>
                    <td style={{ padding: '10px 14px' }}>{p.category}</td>
                    <td style={{ padding: '10px 14px' }}>{p.marketplace}</td>
                    <td style={{ padding: '10px 14px' }}>₹{p.mrp}</td>
                    <td style={{ padding: '10px 14px' }}>₹{p.cost}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: p.stock === 0 ? '#FFE5E7' : p.stock < 20 ? '#FFF3CD' : '#D8F3DC', color: p.stock === 0 ? '#C1121F' : p.stock < 20 ? '#8B5E00' : '#2D6A4F', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{p.stock === 0 ? 'Out of Stock' : p.stock}</span>
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <button onClick={() => { setEditing(p.id); setForm(p) }} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11, marginRight: 4 }}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)} style={{ background: 'none', border: '1px solid #FFE5E7', color: '#C1121F', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}