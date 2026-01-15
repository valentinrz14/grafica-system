'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Home, ChevronRight, Tag } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import {
  PromotionType,
  type Promotion,
  type UpdatePromotionDto,
} from '@/types/promotion';
import { AuthGuard } from '@/components/auth-guard';

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();
  const promotionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState<UpdatePromotionDto>({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    badgeText: '',
    badgeColor: '#3B82F6',
    type: PromotionType.PERCENTAGE,
    discountValue: 0,
    startDate: '',
    endDate: '',
    maxUses: undefined,
    active: true,
    priority: 0,
    categoryIds: [],
    productIds: [],
    minPurchase: undefined,
  });

  useEffect(() => {
    loadPromotion();
  }, [promotionId]);

  const loadPromotion = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getPromotionById(promotionId);
      setPromotion(data);

      // Populate form with existing data
      setFormData({
        name: data.name,
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        badgeText: data.badgeText || '',
        badgeColor: data.badgeColor || '#3B82F6',
        type: data.type,
        discountValue: data.discountValue,
        startDate: new Date(data.startDate).toISOString().slice(0, 16),
        endDate: new Date(data.endDate).toISOString().slice(0, 16),
        maxUses: data.maxUses || undefined,
        active: data.active,
        priority: data.priority,
        categoryIds: data.categoryIds,
        productIds: data.productIds,
        minPurchase: data.minPurchase || undefined,
      });
    } catch (err: any) {
      console.error('Error loading promotion:', err);
      setError(err.message || 'Failed to load promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? undefined : parseFloat(value);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Prepare data
      const submitData: any = {
        ...formData,
        startDate: new Date(formData.startDate!).toISOString(),
        endDate: new Date(formData.endDate!).toISOString(),
      };

      // Remove empty optional fields
      if (!submitData.title) delete submitData.title;
      if (!submitData.subtitle) delete submitData.subtitle;
      if (!submitData.description) delete submitData.description;
      if (!submitData.imageUrl) delete submitData.imageUrl;
      if (!submitData.badgeText) delete submitData.badgeText;
      if (!submitData.maxUses) delete submitData.maxUses;
      if (!submitData.minPurchase) delete submitData.minPurchase;

      await apiClient.updatePromotion(promotionId, submitData);
      router.push('/admin/promotions');
    } catch (err: any) {
      console.error('Error updating promotion:', err);
      setError(err.message || 'Failed to update promotion');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard requireAdmin={true}>
      {loading ? (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-600">Loading promotion...</div>
            </div>
          </div>
        </div>
      ) : error && !promotion ? (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Go back
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <nav className="flex items-center gap-2 text-sm flex-wrap">
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Panel Admin</span>
                </button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <button
                  onClick={() => router.push('/admin/promotions')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Promociones
                </button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-purple-600 font-medium">
                  Editar Promoción
                </span>
              </nav>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Tag className="h-6 w-6 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Editar Promoción
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Actualizar detalles de la campaña promocional
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-6">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-8 space-y-8"
            >
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Internal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Summer 2024 Sticker Sale"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This name is for admin use only
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Display Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Summer Sale - 20% OFF"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be shown to customers
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="subtitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subtitle
                    </label>
                    <input
                      type="text"
                      id="subtitle"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      placeholder="e.g., Limited time offer on all stickers"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Detailed description of the promotion..."
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Elements */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Visual Elements
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Banner Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-32 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="badgeText"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Badge Text
                      </label>
                      <input
                        type="text"
                        id="badgeText"
                        name="badgeText"
                        value={formData.badgeText}
                        onChange={handleChange}
                        placeholder="e.g., HOT, NEW, LIMITED"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="badgeColor"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Badge Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          id="badgeColor"
                          name="badgeColor"
                          value={formData.badgeColor}
                          onChange={handleChange}
                          className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.badgeColor}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              badgeColor: e.target.value,
                            }))
                          }
                          placeholder="#3B82F6"
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Badge Preview */}
                  {formData.badgeText && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Preview:</span>
                      <span
                        className="px-3 py-1 text-xs font-bold rounded"
                        style={{
                          backgroundColor: formData.badgeColor,
                          color: 'white',
                        }}
                      >
                        {formData.badgeText}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Discount Configuration */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Discount Configuration
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={PromotionType.PERCENTAGE}>
                        Percentage (%)
                      </option>
                      <option value={PromotionType.FIXED_AMOUNT}>
                        Fixed Amount ($)
                      </option>
                      <option value={PromotionType.BUNDLE}>Bundle Deal</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="discountValue"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder={
                        formData.type === PromotionType.PERCENTAGE
                          ? '20'
                          : '500'
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Duration
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Usage & Conditions */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Usage & Conditions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="maxUses"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Maximum Uses
                    </label>
                    <input
                      type="number"
                      id="maxUses"
                      name="maxUses"
                      value={formData.maxUses || ''}
                      onChange={handleChange}
                      min="1"
                      placeholder="Leave empty for unlimited"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {promotion && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current uses: {promotion.currentUses}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="minPurchase"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Minimum Purchase Amount ($)
                    </label>
                    <input
                      type="number"
                      id="minPurchase"
                      name="minPurchase"
                      value={formData.minPurchase || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="Leave empty for no minimum"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Advanced Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Priority
                    </label>
                    <input
                      type="number"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Higher priority promotions are applied first
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="active"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Promotion is active
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
