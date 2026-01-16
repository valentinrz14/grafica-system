'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Tag } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { Promotion } from '@/types/promotion';
import { PromotionStatus } from '@/types/promotion';
import { AuthGuard } from '@/components/auth-guard';
import { PageHeader } from '@/components/PageHeader/PageHeader.component';
import { MobileMenu } from '@/components/mobile-menu';

export default function AdminPromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<PromotionStatus | 'all'>(
    'all',
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const promotionsData = await apiClient.getAllPromotions();
      setPromotions(promotionsData);
    } catch (err: any) {
      console.error('Error loading promotions:', err);
      setError(err.message || 'Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await apiClient.togglePromotionActive(id);
      await loadData();
    } catch (err: any) {
      alert('Error toggling promotion: ' + err.message);
    }
  };

  const handleRenew = async (id: string) => {
    const days = prompt('Enter number of days to extend:');
    if (!days) return;

    const daysNum = parseInt(days, 10);
    if (isNaN(daysNum) || daysNum <= 0) {
      alert('Please enter a valid number of days');
      return;
    }

    try {
      await apiClient.renewPromotion(id, daysNum);
      await loadData();
    } catch (err: any) {
      alert('Error renewing promotion: ' + err.message);
    }
  };

  const handleResetUsage = async (id: string) => {
    if (!confirm('Are you sure you want to reset usage count to 0?')) return;

    try {
      await apiClient.resetPromotionUsage(id);
      await loadData();
    } catch (err: any) {
      alert('Error resetting usage: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this promotion? This action cannot be undone.',
      )
    )
      return;

    try {
      await apiClient.deletePromotion(id);
      await loadData();
    } catch (err: any) {
      alert('Error deleting promotion: ' + err.message);
    }
  };

  const filteredPromotions = promotions.filter((promo) => {
    if (filterStatus === 'all') return true;
    return promo.status === filterStatus;
  });

  const getStatusBadge = (status: PromotionStatus | undefined) => {
    if (!status) return null;

    const colors = {
      [PromotionStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [PromotionStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
      [PromotionStatus.EXPIRED]: 'bg-gray-100 text-gray-800',
      [PromotionStatus.PAUSED]: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <AuthGuard requireAdmin={true}>
      {loading ? (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-16 w-16 animate-spin text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cargando promociones
              </h3>
              <p className="text-gray-500 text-sm">
                Por favor espera un momento...
              </p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          <PageHeader
            title="Gestión de Promociones"
            subtitle="Crear, editar y administrar campañas promocionales"
            icon={Tag}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            actions={
              <>
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Volver al Panel
                </Link>
                <button
                  onClick={() => router.push('/admin/promotions/create')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  + Nueva Promoción
                </button>
              </>
            }
          />

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Filter by status:
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as PromotionStatus | 'all')
                  }
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value={PromotionStatus.ACTIVE}>Active</option>
                  <option value={PromotionStatus.SCHEDULED}>Scheduled</option>
                  <option value={PromotionStatus.EXPIRED}>Expired</option>
                  <option value={PromotionStatus.PAUSED}>Paused</option>
                </select>
                <div className="text-sm text-gray-600">
                  Showing {filteredPromotions.length} of {promotions.length}{' '}
                  promotions
                </div>
              </div>
            </div>

            {/* Promotions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promotion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPromotions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No promotions found. Create your first promotion to get
                        started.
                      </td>
                    </tr>
                  ) : (
                    filteredPromotions.map((promo) => (
                      <tr key={promo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {promo.imageUrl && (
                              <img
                                src={promo.imageUrl}
                                alt={promo.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {promo.name}
                              </div>
                              {promo.title && (
                                <div className="text-xs text-gray-500">
                                  {promo.title}
                                </div>
                              )}
                              {promo.badgeText && (
                                <span
                                  className="inline-block px-2 py-0.5 text-xs rounded mt-1"
                                  style={{
                                    backgroundColor:
                                      promo.badgeColor || '#3B82F6',
                                    color: 'white',
                                  }}
                                >
                                  {promo.badgeText}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {promo.type === 'PERCENTAGE'
                              ? `${promo.discountValue}% OFF`
                              : promo.type === 'FIXED_AMOUNT'
                                ? `$${promo.discountValue} OFF`
                                : 'Bundle'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(promo.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600">
                            <div>
                              Start:{' '}
                              {new Date(promo.startDate).toLocaleDateString()}
                            </div>
                            <div>
                              End:{' '}
                              {new Date(promo.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {promo.maxUses !== null ? (
                              <>
                                <div className="text-gray-900">
                                  {promo.currentUses} / {promo.maxUses}
                                </div>
                                {promo.usagePercentage !== null && (
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div
                                      className="bg-blue-600 h-1.5 rounded-full"
                                      style={{
                                        width: `${promo.usagePercentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-gray-500 text-xs">
                                Unlimited
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/promotions/edit/${promo.id}`,
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleActive(promo.id)}
                              className={`text-sm font-medium ${
                                promo.active
                                  ? 'text-yellow-600 hover:text-yellow-800'
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                            >
                              {promo.active ? 'Pause' : 'Activate'}
                            </button>
                            {promo.status === PromotionStatus.EXPIRED && (
                              <button
                                onClick={() => handleRenew(promo.id)}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                              >
                                Renew
                              </button>
                            )}
                            {promo.maxUses !== null &&
                              promo.currentUses > 0 && (
                                <button
                                  onClick={() => handleResetUsage(promo.id)}
                                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                >
                                  Reset
                                </button>
                              )}
                            <button
                              onClick={() => handleDelete(promo.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
