'use client';

import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Link from 'next/link';

export default function Dashboard() {
  const stats = [
    { label: 'Total Cotizaciones', value: '24', color: 'primary' },
    { label: 'Pendientes', value: '8', color: 'warning' },
    { label: 'Aprobadas', value: '12', color: 'success' },
    { label: 'Rechazadas', value: '4', color: 'error' },
  ];

  const recentQuotes = [
    {
      id: 1,
      client: 'Empresa ABC',
      amount: '$5,200',
      status: 'Pendiente',
      date: '2024-01-15',
    },
    {
      id: 2,
      client: 'Tech Solutions',
      amount: '$8,500',
      status: 'Aprobada',
      date: '2024-01-14',
    },
    {
      id: 3,
      client: 'Retail Corp',
      amount: '$3,200',
      status: 'Rechazada',
      date: '2024-01-13',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pendiente': 'warning',
      'Aprobada': 'success',
      'Rechazada': 'error',
    } as const;
    return variants[status as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Bienvenido al sistema de cotizador"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="elevated" className="p-6">
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Quotes */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900">Cotizaciones Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{quote.client}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{quote.amount}</td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusBadge(quote.status)}>{quote.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quote.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/cotizaciones/${quote.id}`}>
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 p-6">
          <Link href="/cotizaciones">
            <Button variant="secondary">Ver todas las cotizaciones</Button>
          </Link>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/cotizaciones/nueva">
            <Button className="w-full sm:w-auto">
              + Nueva Cotización
            </Button>
          </Link>
          <Link href="/productos">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
