'use client';

import { useState, useEffect } from 'react';
import { apiClient, Order } from '@/lib/api-client';
import { OrderCard } from '@/components/order-card';
import { Settings, Package } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PRINTING' | 'DONE'>('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderCount = (status: 'ALL' | 'PENDING' | 'PRINTING' | 'DONE') => {
    if (status === 'ALL') return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Gestión de pedidos de impresión
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos ({getOrderCount('ALL')})
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'PENDING'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pendientes ({getOrderCount('PENDING')})
            </button>
            <button
              onClick={() => setStatusFilter('PRINTING')}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'PRINTING'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              En impresión ({getOrderCount('PRINTING')})
            </button>
            <button
              onClick={() => setStatusFilter('DONE')}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'DONE'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Listos ({getOrderCount('DONE')})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'ALL'
                ? 'Todavía no se recibieron pedidos'
                : `No hay pedidos en estado "${statusFilter}"`}
            </p>
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
  );
}
