'use client';

import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  const products = [
    {
      id: 1,
      name: 'Producto Premium A',
      category: 'electrónica',
      price: '$299.99',
      stock: 45,
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Producto Estándar B',
      category: 'accesorios',
      price: '$149.99',
      stock: 120,
      rating: 4.2,
    },
    {
      id: 3,
      name: 'Producto Plus C',
      category: 'software',
      price: '$199.99',
      stock: 30,
      rating: 4.8,
    },
    {
      id: 4,
      name: 'Producto Básico D',
      category: 'electrónica',
      price: '$99.99',
      stock: 5,
      rating: 3.9,
    },
    {
      id: 5,
      name: 'Producto Deluxe E',
      category: 'accesorios',
      price: '$349.99',
      stock: 18,
      rating: 4.7,
    },
    {
      id: 6,
      name: 'Producto Bundle F',
      category: 'software',
      price: '$249.99',
      stock: 60,
      rating: 4.3,
    },
  ];

  const getStockBadge = (stock: number) => {
    if (stock > 50) return 'success';
    if (stock > 20) return 'warning';
    return 'error';
  };

  const getStockLabel = (stock: number) => {
    if (stock > 50) return 'Stock Alto';
    if (stock > 20) return 'Stock Medio';
    return 'Stock Bajo';
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'todos' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo de Productos"
        subtitle="Explora nuestro catálogo completo"
        action={
          <Link href="/cotizaciones/nueva">
            <Button>+ Nueva Cotización</Button>
          </Link>
        }
      />

      {/* Filters */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Buscar producto"
            placeholder="Nombre del producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            label="Categoría"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="electrónica">Electrónica</option>
            <option value="accesorios">Accesorios</option>
            <option value="software">Software</option>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} variant="elevated" className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <Badge variant={getStockBadge(product.stock)}>
                    {getStockLabel(product.stock)}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary-600">{product.price}</span>
                    <span className="text-sm text-gray-500">por unidad</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      ⭐ {product.rating}
                    </span>
                    <span className="text-xs text-gray-500">({product.stock} disponibles)</span>
                  </div>
                </div>

                <Button className="w-full">Agregar a Cotización</Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
