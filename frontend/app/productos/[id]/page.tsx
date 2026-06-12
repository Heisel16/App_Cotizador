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

  const inputStyle = { padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: '100%', outline: 'none' }
  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>Cargando...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Editar producto</h1>
          <p style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>Modifica los datos del producto</p>
        </div>
        <Link href="/productos" style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#1a202c' }}>← Volver</Link>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: 13 }}>{error}</div>}

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Nombre *</label>
          <input style={inputStyle} value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Descripción</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Precio (COP) *</label>
            <input style={inputStyle} type="number" min={0} value={form.precio} onChange={e => set('precio', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Unidad</label>
            <input style={inputStyle} value={form.unidad} onChange={e => set('unidad', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Categoría</label>
          <select style={inputStyle} value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            <option value="">Sin categoría</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Link href="/productos" style={{ padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: '#1a202c' }}>Cancelar</Link>
          <button onClick={handleSubmit} disabled={saving} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}