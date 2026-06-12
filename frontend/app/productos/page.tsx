'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productosApi } from '@/lib/api'
import type { Producto } from '@/types'

const CATEGORIAS = ['TODAS', 'PINTURA', 'BARNIZ', 'MOLDURA', 'ACCESORIO', 'MADERA', 'HERRAMIENTA']

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filtro, setFiltro] = useState('TODAS')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    productosApi.listar()
      .then(setProductos)
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Deshabilitar este producto?')) return
    await productosApi.eliminar(id)
    setProductos(prev => prev.filter(p => p.id !== id))
  }

  const filtrados = productos.filter(p => {
    const matchCat = filtro === 'TODAS' || p.categoria === filtro
    const matchBusq = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchBusq
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{productos.length} productos activos</p>
        </div>
        <Link href="/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>
      </div>

      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <input
            className="form-input"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ maxWidth: 280, marginBottom: '1rem' }}
          />
          <div className="filters">
            {CATEGORIAS.map(c => (
              <button
                key={c}
                className={`filter-btn ${filtro === c ? 'active' : ''}`}
                onClick={() => setFiltro(c)}
              >
                {c === 'TODAS' ? 'Todas' : c.charAt(0) + c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-msg" style={{ margin: '0 1.25rem 1rem' }}>{error}</div>}

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p>No hay productos registrados.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Unidad</th>
                  <th style={{ textAlign: 'right' }}>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                      {p.descripcion && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.descripcion}</div>}
                    </td>
                    <td>
                      {p.categoria
                        ? <span className="badge" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>{p.categoria}</span>
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.unidad || '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(Number(p.precio))}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/productos/${p.id}`} className="btn btn-outline btn-sm">Editar</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(p.id)}>Deshabilitar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}