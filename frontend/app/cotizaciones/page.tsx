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
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
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

  const totales = {
    total: cotizaciones.length,
    pendientes: cotizaciones.filter(c => c.estado === 'PENDIENTE').length,
    aprobadas: cotizaciones.filter(c => c.estado === 'APROBADA').length,
    valor: cotizaciones.reduce((s, c) => s + (c.total || 0), 0),
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cotizaciones</h1>
          <p className="page-subtitle">Gestión de cotizaciones de clientes</p>
        </div>
        <Link href="/cotizaciones/nueva" className="btn btn-primary">+ Nueva cotización</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{totales.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendientes</div>
          <div className="stat-value" style={{ color: 'var(--yellow-600)' }}>{totales.pendientes}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Aprobadas</div>
          <div className="stat-value" style={{ color: 'var(--green-600)' }}>{totales.aprobadas}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor total</div>
          <div className="stat-value" style={{ fontSize: 16 }}>{formatCurrency(totales.valor)}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body">
          <div className="filters">
            {ESTADOS.map(e => (
              <button
                key={e.value}
                className={`filter-btn ${filtro === e.value ? 'active' : ''}`}
                onClick={() => setFiltro(e.value)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : cotizaciones.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No hay cotizaciones registradas.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Tabla para desktop */}
          <div className="card desktop-only">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Items</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.cliente}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.telefono || '—'}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.items?.length ?? 0} items</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(c.total || 0)}</td>
                      <td><span className={`badge ${badgeClass[c.estado]}`}>{c.estado}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(c.fechaCreacion)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <Link href={`/cotizaciones/detalle?id=${c.id}`} className="btn btn-outline btn-sm">Ver</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(c.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tarjetas para móvil */}
          <div className="mobile-only" style={{ flexDirection: 'column', gap: 12 }}>
            {cotizaciones.map(c => (
              <div key={c.id} className="card card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.cliente}</div>
                    {c.telefono && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>📞 {c.telefono}</div>}
                  </div>
                  <span className={`badge ${badgeClass[c.estado]}`}>{c.estado}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>{formatCurrency(c.total || 0)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha</div>
                      <div style={{ fontSize: 13 }}>{formatDate(c.fechaCreacion)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</div>
                      <div style={{ fontSize: 13 }}>{c.items?.length ?? 0}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/cotizaciones/${c.id}`} className="btn btn-outline btn-sm">Ver</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(c.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}