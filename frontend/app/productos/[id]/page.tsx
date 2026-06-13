'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { productosApi } from '@/lib/api'
import type { Categoria } from '@/types'

const CATEGORIAS: Categoria[] = ['PINTURA', 'BARNIZ', 'MOLDURA', 'ACCESORIO', 'MADERA', 'HERRAMIENTA']

export default function EditarProductoPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', categoria: '' as Categoria | '', unidad: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    productosApi.buscarPorId(id)
      .then(p => setForm({
        nombre: p.nombre,
        descripcion: p.descripcion || '',
        precio: String(p.precio),
        categoria: (p.categoria as Categoria) || '',
        unidad: p.unidad || ''
      }))
      .catch(() => setError('No se encontró el producto.'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    if (!form.precio || Number(form.precio) <= 0) { setError('El precio debe ser mayor a 0.'); return }
    setSaving(true)
    setError('')
    try {
      await productosApi.actualizar(id, {
        nombre: form.nombre,
        descripcion: form.descripcion || undefined,
        precio: Number(form.precio),
        categoria: form.categoria as Categoria || undefined,
        unidad: form.unidad || undefined,
      })
      router.push('/productos')
    } catch {
      setError('Error al actualizar el producto.')
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Editar producto</h1>
          <p className="page-subtitle">Modifica los datos del producto</p>
        </div>
        <Link href="/productos" className="btn btn-outline">← Volver</Link>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Precio (COP) *</label>
              <input className="form-input" type="number" min={0} value={form.precio} onChange={e => set('precio', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Unidad</label>
              <input className="form-input" value={form.unidad} onChange={e => set('unidad', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select className="form-select" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
              <option value="">Sin categoría</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '0.5rem' }}>
            <Link href="/productos" className="btn btn-outline">Cancelar</Link>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}