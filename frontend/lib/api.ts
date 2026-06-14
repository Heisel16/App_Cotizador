import axios from 'axios'
import type { Producto, Cotizacion, CreateProductoDto, CreateCotizacionDto, EstadoCotizacion } from '@/types'

const api = axios.create({
  baseURL: 'https://appcotizador-production-f3b0.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
})

// Productos
export const productosApi = {
  listar: () => api.get<Producto[]>('/productos').then(r => r.data),
  buscarPorId: (id: string) => api.get<Producto>(`/productos/${id}`).then(r => r.data),
  buscarPorNombre: (nombre: string) => api.post<Producto[]>(`/productos/buscar?nombre=${encodeURIComponent(nombre)}`).then(r => r.data),
  crear: (data: CreateProductoDto) => api.post<Producto>('/productos', data).then(r => r.data),
  actualizar: (id: string, data: CreateProductoDto) => api.put<Producto>(`/productos/${id}`, data).then(r => r.data),
  eliminar: (id: string) => api.delete(`/productos/${id}`),
}

// Cotizaciones
export const cotizacionesApi = {
  listar: () => api.get<Cotizacion[]>('/cotizaciones').then(r => r.data),
  buscarPorId: (id: string) => api.get<Cotizacion>(`/cotizaciones/${id}`).then(r => r.data),
  buscarPorEstado: (estado: EstadoCotizacion) => api.get<Cotizacion[]>(`/cotizaciones/estado/${estado}`).then(r => r.data),
  crear: (data: CreateCotizacionDto) => api.post<Cotizacion>('/cotizaciones', data).then(r => r.data),
  actualizarEstado: (id: string, estado: EstadoCotizacion) => api.patch<Cotizacion>(`/cotizaciones/${id}/estado?estado=${estado}`).then(r => r.data),
  eliminar: (id: string) => api.delete(`/cotizaciones/${id}`),
}

export default api