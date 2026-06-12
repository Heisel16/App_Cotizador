'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cotizacionesApi } from '@/lib/api'
import type { Cotizacion, EstadoCotizacion } from '@/types'

const ESTADOS: EstadoCotizacion[] = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'COMPLETADA']

const badgeStyle: Record<string, { background: string; color: string }> = {
  PENDIENTE:  { background: '#fffbeb', color: '#d97706' },
  APROBADA:   { background: '#f0fdf4', color: '#16a34a' },
  RECHAZADA:  { background: '#fef2f2', color: '#dc2626' },
  COMPLETADA: { background: '#eff6ff', color: '#2563eb' },
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

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>Cargando...</div>
  if (error || !cotizacion) return <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, maxWidth: 600, fontSize: 13 }}>{error || 'Cotización no encontrada.'}</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>{cotizacion.cliente}</h1>
          <p style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>Creada el {formatDate(cotizacion.fechaCreacion)}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/cotizaciones" style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#1a202c' }}>← Volver</Link>
          <button onClick={handleEliminar} style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, cursor: 'pointer', background: 'white', color: '#dc2626' }}>Eliminar</button>
        </div>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: 13 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Cliente</div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{cotizacion.cliente}</div>
          {cotizacion.telefono && <div style={{ color: '#718096', marginTop: 4, fontSize: 14 }}>📞 {cotizacion.telefono}</div>}
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Estado</div>
          <span style={{ ...badgeStyle[cotizacion.estado], padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>{cotizacion.estado}</span>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {ESTADOS.filter(e => e !== cotizacion.estado).map(e => (
              <button key={e} onClick={() => cambiarEstado(e)} disabled={updatingEstado} style={{ padding: '0.35rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'white', color: '#1a202c' }}>
                → {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Productos</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Producto', 'Cantidad', 'Precio unit.', 'Subtotal'].map((h, i) => (
                <th key={h} style={{ textAlign: i > 0 ? 'right' : 'left', padding: '0.75rem 1rem', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cotizacion.items?.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{item.nombreProducto}</td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', color: '#718096' }}>{item.cantidad}</td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', color: '#718096' }}>{formatCurrency(item.precioUnitario)}</td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, padding: '0.875rem 1rem', borderTop: '1px solid #e2e8f0', background: '#f8f9fa' }}>
          <span style={{ color: '#718096', fontSize: 13 }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#2563eb' }}>{formatCurrency(cotizacion.total)}</span>
        </div>
      </div>
    </div>
  )
}