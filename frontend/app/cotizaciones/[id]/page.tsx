'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesApi } from '@/lib/api'
import type { Cotizacion, EstadoCotizacion } from '@/types'

const ESTADOS: EstadoCotizacion[] = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA']

const badgeClass: Record<string, string> = {
  PENDIENTE: 'badge-pendiente',
  APROBADA: 'badge-aprobada',
  RECHAZADA: 'badge-rechazada',
  COMPLETADA: 'badge-completada',
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function CotizacionDetallePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingEstado, setUpdatingEstado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cotizacionesApi.buscarPorId(id)
      .then(setCotizacion)
      .catch(() => setError('No se encontró la cotización.'))
      .finally(() => setLoading(false))
  }, [id])

  const cambiarEstado = async (estado: EstadoCotizacion) => {
    if (!cotizacion) return
    setUpdatingEstado(true)
    try {
      const updated = await cotizacionesApi.actualizarEstado(id, estado)
      setCotizacion(updated)
    } catch {
      setError('Error al actualizar el estado.')
    } finally {
      setUpdatingEstado(false)
    }
  }

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar esta cotización? Esta acción no se puede deshacer.')) return
    await cotizacionesApi.eliminar(id)
    router.push('/cotizaciones')
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (error || !cotizacion) return <div className="error-msg" style={{ maxWidth: 600 }}>{error || 'Cotización no encontrada.'}</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{cotizacion.cliente}</h1>
          <p className="page-subtitle">Creada el {formatDate(cotizacion.fechaCreacion)}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/cotizaciones" className="btn btn-outline">← Volver</Link>
          <button className="btn btn-danger" onClick={handleEliminar}>Eliminar</button>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Info cliente y estado */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="card">
          <div className="card-body">
            <p className="section-title">Cliente</p>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{cotizacion.cliente}</div>
            {cotizacion.telefono && (
              <div style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>📞 {cotizacion.telefono}</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <p className="section-title">Estado</p>
            <span className={`badge ${badgeClass[cotizacion.estado]}`} style={{ fontSize: 13, padding: '4px 12px' }}>
              {cotizacion.estado}
            </span>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {ESTADOS.filter(e => e !== cotizacion.estado).map(e => (
                <button
                  key={e}
                  className="btn btn-outline btn-sm"
                  onClick={() => cambiarEstado(e)}
                  disabled={updatingEstado}
                >
                  → {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla productos desktop */}
      <div className="card desktop-only">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <p className="section-title">Productos</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{ textAlign: 'right' }}>Cantidad</th>
                <th style={{ textAlign: 'right' }}>Precio unit.</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cotizacion.items?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{item.nombreProducto}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{item.cantidad}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{formatCurrency(item.precioUnitario)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="total-row">
          <span className="total-label">Total</span>
          <span className="total-amount">{formatCurrency(cotizacion.total)}</span>
        </div>
      </div>

      {/* Tarjetas productos móvil */}
      <div className="mobile-only" style={{ flexDirection: 'column', gap: 10 }}>
        <p className="section-title">Productos</p>
        {cotizacion.items?.map((item, i) => (
          <div key={i} className="card card-body">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{item.nombreProducto}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cantidad</div>
                <div>{item.cantidad}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio unit.</div>
                <div>{formatCurrency(item.precioUnitario)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtotal</div>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(item.subtotal)}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="total-label">Total</span>
          <span className="total-amount">{formatCurrency(cotizacion.total)}</span>
        </div>
      </div>
    </div>
  )
}