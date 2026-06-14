'use client'
import Link from 'next/link'

const recentQuotes = [
  { id: '1', client: 'Empresa ABC', amount: '$5.200', status: 'PENDIENTE', date: '2024-01-15' },
  { id: '2', client: 'Tech Solutions', amount: '$8.500', status: 'APROBADA', date: '2024-01-14' },
  { id: '3', client: 'Retail Corp', amount: '$3.200', status: 'RECHAZADA', date: '2024-01-13' },
]

const badgeClass: Record<string, string> = {
  PENDIENTE: 'badge-pendiente',
  APROBADA: 'badge-aprobada',
  RECHAZADA: 'badge-rechazada',
  COMPLETADA: 'badge-completada',
}

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Bienvenido al sistema de cotizaciones</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total cotizaciones</div>
          <div className="stat-value">24</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pendientes</div>
          <div className="stat-value" style={{ color: 'var(--yellow-600)' }}>8</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Aprobadas</div>
          <div className="stat-value" style={{ color: 'var(--green-600)' }}>12</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rechazadas</div>
          <div className="stat-value" style={{ color: 'var(--red-600)' }}>4</div>
        </div>
      </div>

      {/* Cotizaciones recientes */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Cotizaciones recientes</h2>
        </div>

        {/* Tabla desktop */}
        <div className="desktop-only">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 500 }}>{q.client}</td>
                    <td style={{ fontWeight: 600 }}>{q.amount}</td>
                    <td><span className={`badge ${badgeClass[q.status]}`}>{q.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{q.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/cotizaciones/editar?id=${q.id}`} className="btn btn-outline btn-sm">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tarjetas móvil */}
        <div className="mobile-only" style={{ flexDirection: 'column', gap: 10, padding: '1rem' }}>
          {recentQuotes.map(q => (
            <div key={q.id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{q.client}</div>
                <span className={`badge ${badgeClass[q.status]}`}>{q.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monto</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{q.amount}</div>
                </div>
                <Link href={`/cotizaciones/${q.id}`} className="btn btn-outline btn-sm">Ver</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="card-body" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/cotizaciones" className="btn btn-outline">Ver todas las cotizaciones</Link>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card">
        <div className="card-body">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem' }}>Acciones rápidas</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/cotizaciones/nueva" className="btn btn-primary">+ Nueva cotización</Link>
            <Link href="/productos" className="btn btn-outline">Ver catálogo</Link>
          </div>
        </div>
      </div>
    </div>
  )
}