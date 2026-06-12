'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cotizacionesApi } from '@/lib/api'
import type { Cotizacion, EstadoCotizacion } from '@/types'

const ESTADOS: { value: EstadoCotizacion | 'TODAS'; label: string }[] = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADA', label: 'Aprobada' },
  { value: 'RECHAZADA', label: 'Rechazada' },
  { value: 'COMPLETADA', label: 'Completada' },
]

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const badgeStyle: Record<string, { background: string; color: string }> = {
  PENDIENTE:  { background: '#fffbeb', color: '#d97706' },
  APROBADA:   { background: '#f0fdf4', color: '#16a34a' },
  RECHAZADA:  { background: '#fef2f2', color: '#dc2626' },
  COMPLETADA: { background: '#eff6ff', color: '#2563eb' },
}

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [filtro, setFiltro] = useState<EstadoCotizacion | 'TODAS'>('TODAS')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const fetch = filtro === 'TODAS'
      ? cotizacionesApi.listar()
      : cotizacionesApi.buscarPorEstado(filtro)
    fetch
      .then(setCotizaciones)
      .catch(() => setError('No se pudieron cargar las cotizaciones.'))
      .finally(() => setLoading(false))
  }, [filtro])

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta cotización?')) return
    await cotizacionesApi.eliminar(id)
    setCotizaciones(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Cotizaciones</h1>
          <p style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>Gestión de cotizaciones de clientes</p>
        </div>
        <Link href="/cotizaciones/nueva" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          + Nueva cotización
        </Link>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ESTADOS.map(e => (
              <button key={e.value} onClick={() => setFiltro(e.value)} style={{
                padding: '0.4rem 0.875rem', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                border: '1px solid', borderColor: filtro === e.value ? '#2563eb' : '#e2e8f0',
                background: filtro === e.value ? '#2563eb' : 'white',
                color: filtro === e.value ? 'white' : '#718096',
              }}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', margin: '1rem 1.25rem', borderRadius: 8, fontSize: 13 }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>Cargando...</div>
        ) : cotizaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>
            <div style={{ fontSize: 40, marginBottom: '1rem' }}>📋</div>
            <p>No hay cotizaciones registradas.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Cliente', 'Teléfono', 'Items', 'Total', 'Estado', 'Fecha', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 500 }}>{c.cliente}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#718096' }}>{c.telefono || '—'}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#718096' }}>{c.items?.length ?? 0} items</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{formatCurrency(c.total || 0)}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ ...badgeStyle[c.estado], padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{c.estado}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#718096' }}>{formatDate(c.fechaCreacion)}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/cotizaciones/${c.id}`} style={{ padding: '0.35rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, textDecoration: 'none', color: '#1a202c' }}>Ver</Link>
                      <button onClick={() => handleEliminar(c.id)} style={{ padding: '0.35rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'white', color: '#dc2626' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}