'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OrderCard } from '@/components/order-card';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext/ToastContext.context';
import { useAuth } from '@/context/AuthContext/AuthContext.context';
import { AuthGuard } from '@/components/auth-guard';
import { MobileMenu } from '@/components/mobile-menu';
import { PageHeader } from '@/components/PageHeader/PageHeader.component';
import { LoadingSpinner } from '@/design-system/components/LoadingSpinner/LoadingSpinner.component';
import { EmptyState } from '@/components/EmptyState/EmptyState.component';
import { useMyOrders } from '@/lib/hooks/use-orders';

export default function MyOrdersPage() {
  const { showToast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('🔍 MyOrders Auth State:', {
      isAuthenticated,
      authLoading,
      hasUser: !!user,
      userEmail: user?.email,
    });
  }, [isAuthenticated, authLoading, user]);

  const {
    data: orders = [],
    isLoading,
    error,
  } = useMyOrders(isAuthenticated && !authLoading);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (
      isMounted &&
      !authLoading &&
      isAuthenticated &&
      user?.role === 'ADMIN'
    ) {
      router.push('/admin');
    }
  }, [isMounted, authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (error) {
      // Don't show error if it's just "not authenticated" - AuthGuard will handle redirect
      const errorMessage = error.message || error.toString();
      if (errorMessage !== 'NOT_AUTHENTICATED') {
        showToast('Error al cargar tus pedidos', 'error');
      }
    }
  }, [error, showToast]);

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
