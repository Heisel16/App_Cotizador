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
      setItems(items.map(i => i.productoId === productoSel.id
        ? { ...i, cantidad: i.cantidad + cantidad }
        : i
      ))
    } else {
      setItems([...items, {
        productoId: productoSel.id,
        nombreProducto: productoSel.nombre,
        cantidad,
        precioUnitario: Number(productoSel.precio)
      }])
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

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Nueva cotización</h1>
          <p className="page-subtitle">Completa los datos del cliente y selecciona los productos</p>
        </div>
        <Link href="/cotizaciones" className="btn btn-outline">← Volver</Link>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Datos del cliente */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body">
          <p className="section-title">Datos del cliente</p>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nombre del cliente *</label>
              <input className="form-input" value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Ej. Carlos Pérez" />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej. 300 123 4567" />
            </div>
          </div>
        </div>
      </div>

      {/* Agregar productos */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body">
          <p className="section-title">Agregar producto</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Producto</label>
              <select className="form-select" value={productoSelId} onChange={e => setProductoSelId(e.target.value)}>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {formatCurrency(Number(p.precio))}{p.unidad ? ` / ${p.unidad}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Cant.</label>
              <input
                className="form-input"
                type="number"
                min={1}
                value={cantidad}
                onChange={e => setCantidad(Number(e.target.value))}
                style={{ width: 80 }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={agregarItem}
              disabled={!productoSelId}
              style={{ opacity: productoSelId ? 1 : 0.5 }}
            >
              Agregar
            </button>
          </div>

          {items.length > 0 && (
            <div className="items-table">
              <div className="items-header">
                <span>Producto</span>
                <span>Cant.</span>
                <span>Subtotal</span>
                <span></span>
              </div>
              {items.map(item => (
                <div key={item.productoId} className="item-row">
                  <span style={{ fontWeight: 600 }}>{item.nombreProducto}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.cantidad}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatCurrency(item.precioUnitario * item.cantidad)}</span>
                  <button
                    onClick={() => quitarItem(item.productoId)}
                    style={{ background: 'none', border: 'none', color: 'var(--red-600)', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
                  >✕</button>
                </div>
              ))}
              <div className="total-row">
                <span className="total-label">Total estimado</span>
                <span className="total-amount">{formatCurrency(total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Link href="/cotizaciones" className="btn btn-outline">Cancelar</Link>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Crear cotización'}
        </button>
      </div>
    </div>
  )
}