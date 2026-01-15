'use client';

import { useParams, useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/StatusBadge/StatusBadge.component';
import { FilePreview } from '@/components/file-preview';
import { LoadingSpinner } from '@/design-system/components/LoadingSpinner/LoadingSpinner.component';
import { formatOrderDate } from '@/lib/utils';
import { ArrowLeft, Mail, Calendar, Package } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext/ToastContext.context';
import { AuthGuard } from '@/components/auth-guard';
import { useOrder, useUpdateOrderStatus } from '@/lib/hooks/use-orders';

export default function OrderDetailPage() {
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { data: order, isLoading, error } = useOrder(orderId);
  const updateOrderStatus = useUpdateOrderStatus();

  if (error) {
    showToast('Error al cargar el pedido', 'error');
    router.push('/admin');
  }

  const handleStatusChange = async (
    newStatus: 'PENDING' | 'PRINTING' | 'DONE' | 'EXPIRED',
  ) => {
    if (!order) return;

    try {
      await updateOrderStatus.mutateAsync({
        id: order.id,
        status: newStatus,
      });
      showToast('Estado actualizado correctamente', 'success');
    } catch {
      showToast('Error al actualizar el estado', 'error');
    }
  };

  return (
    <AuthGuard requireAdmin={true}>
      {isLoading ? (
        <LoadingSpinner text="Cargando pedido..." fullScreen />
      ) : !order ? null : (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a pedidos
              </Link>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Pedido #{order.id.slice(0, 8)}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Creado el {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Información del cliente
                  </h2>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-5 w-5" />
                    <span>{order.userEmail}</span>
                  </div>
                </div>

                {/* Print Options */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Opciones de impresión
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tamaño</p>
                      <p className="font-medium text-gray-900">
                        {order.options.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cantidad</p>
                      <p className="font-medium text-gray-900">
                        {order.options.quantity}{' '}
                        {order.options.quantity === 1 ? 'copia' : 'copias'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-medium text-gray-900">
                        {order.options.isColor ? 'Color' : 'Blanco y Negro'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Impresión</p>
                      <p className="font-medium text-gray-900">
                        {order.options.isDuplex ? 'Doble faz' : 'Simple faz'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Files */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Archivos ({order.files.length})
                  </h2>
                  <div className="space-y-3">
                    {order.files.map((file) => (
                      <FilePreview
                        key={file.id}
                        file={file}
                        showDownload={true}
                      />
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Total de páginas:{' '}
                      <span className="font-medium text-gray-900">
                        {order.files.reduce((sum, f) => sum + f.pages, 0)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="space-y-8">
                {/* Price */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Precio total
                  </h2>
                  <p className="text-4xl font-bold text-blue-600">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>

                {/* Status Update */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Actualizar estado
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleStatusChange('PENDING')}
                      disabled={
                        updateOrderStatus.isPending ||
                        order.status === 'PENDING'
                      }
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200"
                    >
                      Pendiente
                    </button>
                    <button
                      onClick={() => handleStatusChange('PRINTING')}
                      disabled={
                        updateOrderStatus.isPending ||
                        order.status === 'PRINTING'
                      }
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
                    >
                      En impresión
                    </button>
                    <button
                      onClick={() => handleStatusChange('DONE')}
                      disabled={
                        updateOrderStatus.isPending || order.status === 'DONE'
                      }
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-50 text-green-800 hover:bg-green-100 border border-green-200"
                    >
                      Listo
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Información
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-600">Creado</p>
                        <p className="font-medium text-gray-900">
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-600">Última actualización</p>
                        <p className="font-medium text-gray-900">
                          {formatOrderDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
