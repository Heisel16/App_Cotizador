export type Categoria = 'PINTURA' | 'BARNIZ' | 'MOLDURA' | 'ACCESORIO' | 'MADERA' | 'HERRAMIENTA'

export type EstadoCotizacion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA'

export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  categoria?: Categoria
  unidad?: string
  disponible: boolean
}

export interface ItemCotizacion {
  productoId: string
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Cotizacion {
  id: string
  cliente: string
  telefono?: string
  items: ItemCotizacion[]
  total: number
  estado: EstadoCotizacion
  fechaCreacion: string
}

export interface CreateProductoDto {
  nombre: string
  descripcion?: string
  precio: number
  categoria?: Categoria
  unidad?: string
  disponible?: boolean
}

export interface CreateCotizacionDto {
  cliente: string
  telefono?: string
  items: { productoId: string; cantidad: number }[]
}