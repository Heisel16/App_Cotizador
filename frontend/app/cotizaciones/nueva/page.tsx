'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { productosApi, cotizacionesApi } from '@/lib/api'
import type { Producto } from '@/types'

interface ItemForm {
  productoId: string
  nombreProducto: string
  cantidad: number
  precioUnitario: number
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function NuevaCotizacionPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [cliente, setCliente] = useState('')
  const [telefono, setTelefono] = useState('')
  const [items, setItems] = useState<ItemForm[]>([])
  const [productoSelId, setProductoSelId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    productosApi.listar().then(setProductos)
  }, [])

  const productoSel = productos.find(p => p.id === productoSelId)

  const agregarItem = () => {
    if (!productoSel) return
    const existe = items.find(i => i.productoId === productoSel.id)
    if (existe) {
      setItems(items.map(i => i.productoId === productoSel.id ? { ...i, cantidad: i.cantidad + cantidad } : i))
    } else {
      setItems([...items, { productoId: productoSel.id, nombreProducto: productoSel.nombre, cantidad, precioUnitario: Number(productoSel.precio) }])
    }
    setProductoSelId('')
    setCantidad(1)
  }

  const quitarItem = (id: string) => setItems(items.filter(i => i.productoId !== id))

  const total = items.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0)

  const handleSubmit = async () => {
    if (!cliente.trim()) { setError('El nombre del cliente es obligatorio.'); return }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    setLoading(true)
    setError('')
    try {
      await cotizacionesApi.crear({
        cliente,
        telefono: telefono || undefined,
        items: items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad })),
      })
      router.push('/cotizaciones')
    } catch {
      setError('Error al crear la cotización. Verifica que el backend esté activo.')
      setLoading(false)
    }
  }

  const inputStyle = { padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: '100%', outline: 'none' }
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Nueva cotización</h1>
          <p style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>Completa los datos del cliente y selecciona los productos</p>
        </div>
        <Link href="/cotizaciones" style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#1a202c' }}>← Volver</Link>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: 13 }}>{error}</div>}

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Datos del cliente</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nombre del cliente *</label>
            <input style={inputStyle} value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Ej. Carlos Pérez" />
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input style={inputStyle} value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej. 300 123 4567" />
          </div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Agregar producto</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Producto</label>
            <select style={inputStyle} value={productoSelId} onChange={e => setProductoSelId(e.target.value)}>
              <option value="">Seleccionar producto...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} — {formatCurrency(Number(p.precio))}{p.unidad ? ` / ${p.unidad}` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Cantidad</label>
            <input style={{ ...inputStyle, width: 90 }} type="number" min={1} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
          </div>
          <button onClick={agregarItem} disabled={!productoSelId} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: productoSelId ? 'pointer' : 'not-allowed', opacity: productoSelId ? 1 : 0.5 }}>
            Agregar
          </button>
        </div>

        {items.length > 0 && (
          <div style={{ marginTop: '1.25rem', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, padding: '0.6rem 1rem', background: '#f8f9fa', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Producto</span><span>Cant.</span><span>Subtotal</span><span></span>
            </div>
            {items.map(item => (
              <div key={item.productoId} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{item.nombreProducto}</span>
                <span style={{ color: '#718096' }}>{item.cantidad}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(item.precioUnitario * item.cantidad)}</span>
                <button onClick={() => quitarItem(item.productoId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderTop: '1px solid #e2e8f0', background: '#f8f9fa' }}>
              <span style={{ color: '#718096', fontSize: 13 }}>Total estimado</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#2563eb' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Link href="/cotizaciones" style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#1a202c' }}>Cancelar</Link>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Guardando...' : 'Crear cotización'}
        </button>
      </div>
    </div>
  )
}