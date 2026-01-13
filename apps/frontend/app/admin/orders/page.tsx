'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrderCard } from '@/components/order-card';
import { Package } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { MobileMenu } from '@/components/mobile-menu';
import { PageHeader } from '@/components/PageHeader/PageHeader.component';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner.component';
import { EmptyState } from '@/components/EmptyState/EmptyState.component';
import { useOrders } from '@/lib/hooks/use-orders';

export default function OrdersPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: orders = [], isLoading, error } = useOrders();

  if (error) {
    showToast('Error al cargar tus pedidos', 'error');
  }

  return (
    <AuthGuard requireAdmin={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <PageHeader
          title="Mis Pedidos"
          subtitle={user?.email}
          icon={Package}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          actions={
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Volver al inicio
            </Link>
          }
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
          {isLoading ? (
            <LoadingSpinner text="Cargando tus pedidos..." />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No tenés pedidos todavía"
              description="Creá tu primer pedido desde la página principal"
              actionLabel="Crear pedido"
              actionHref="/"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Todos tus pedidos ({orders.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} clickable={false} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
