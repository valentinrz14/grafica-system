'use client';

import { useState, useMemo } from 'react';
import { OrderCard } from '@/components/order-card';
import { Settings, Package, Search, X } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import { AuthGuard } from '@/components/auth-guard';
import { MobileMenu } from '@/components/mobile-menu';
import { PageHeader } from '@/components/PageHeader/PageHeader.component';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner.component';
import { useOrders } from '@/lib/hooks/use-orders';

export default function AdminPage() {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED'
  >('ALL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<
    'ALL' | 'TODAY' | 'WEEK' | 'MONTH'
  >('ALL');
  const { data: orders = [], isLoading, error, refetch } = useOrders();
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.userEmail.toLowerCase().includes(query) ||
          o.id.toLowerCase().includes(query),
      );
    }

    if (dateFilter !== 'ALL') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((o) => {
        const orderDate = new Date(o.createdAt);

        if (dateFilter === 'TODAY') {
          return orderDate >= today;
        } else if (dateFilter === 'WEEK') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === 'MONTH') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }

        return true;
      });
    }

    return filtered;
  }, [orders, statusFilter, searchQuery, dateFilter]);

  const getOrderCount = (
    status: 'ALL' | 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED',
  ) => {
    if (status === 'ALL') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  if (error) {
    showToast('Error al cargar los pedidos', 'error');
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <PageHeader
          title="Panel Admin"
          subtitle="Gestión de pedidos de impresión"
          icon={Settings}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          actions={
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-700 hover:text-white transition-colors whitespace-nowrap font-medium"
            >
              Recargar
            </button>
          }
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
          <div className="space-y-4 mb-6 md:mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por email o ID de pedido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <div className="grid grid-cols-2 md:flex gap-2">
                <button
                  onClick={() => setDateFilter('ALL')}
                  className={`px-3 md:flex-1 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    dateFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todos los tiempos
                </button>
                <button
                  onClick={() => setDateFilter('TODAY')}
                  className={`px-3 md:flex-1 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    dateFilter === 'TODAY'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Hoy
                </button>
                <button
                  onClick={() => setDateFilter('WEEK')}
                  className={`px-3 md:flex-1 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    dateFilter === 'WEEK'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Última semana
                </button>
                <button
                  onClick={() => setDateFilter('MONTH')}
                  className={`px-3 md:flex-1 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    dateFilter === 'MONTH'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Último mes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 md:flex-1 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    statusFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todos ({getOrderCount('ALL')})
                </button>
                <button
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-3 md:flex-1 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    statusFilter === 'PENDING'
                      ? 'bg-yellow-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pendientes ({getOrderCount('PENDING')})
                </button>
                <button
                  onClick={() => setStatusFilter('PRINTING')}
                  className={`px-3 md:flex-1 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    statusFilter === 'PRINTING'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Imprimiendo ({getOrderCount('PRINTING')})
                </button>
                <button
                  onClick={() => setStatusFilter('DONE')}
                  className={`px-3 md:flex-1 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    statusFilter === 'DONE'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Listos ({getOrderCount('DONE')})
                </button>
                <button
                  onClick={() => setStatusFilter('EXPIRED')}
                  className={`px-3 md:flex-1 md:px-6 py-2 md:py-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
                    statusFilter === 'EXPIRED'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Vencidos ({getOrderCount('EXPIRED')})
                </button>
              </div>
            </div>

            {(searchQuery ||
              dateFilter !== 'ALL' ||
              statusFilter !== 'ALL') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Mostrando <strong>{filteredOrders.length}</strong> de{' '}
                  <strong>{orders.length}</strong> pedidos
                  {searchQuery && ` • Búsqueda: "${searchQuery}"`}
                  {statusFilter !== 'ALL' && ` • Estado: ${statusFilter}`}
                  {dateFilter !== 'ALL' && ` • Período: ${dateFilter}`}
                </p>
              </div>
            )}
          </div>

          {isLoading ? (
            <LoadingSpinner text="Cargando pedidos..." />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay pedidos
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? `No se encontraron pedidos con "${searchQuery}"`
                  : statusFilter === 'ALL' && dateFilter === 'ALL'
                    ? 'Todavía no se recibieron pedidos'
                    : 'No hay pedidos que coincidan con los filtros'}
              </p>
              {(searchQuery ||
                statusFilter !== 'ALL' ||
                dateFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setDateFilter('ALL');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
