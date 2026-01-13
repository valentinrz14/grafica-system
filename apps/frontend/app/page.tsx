'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadForm } from '@/components/upload-form';
import { PriceCalculator } from '@/components/price-calculator';
import {
  apiClient,
  OrderOptions,
  UploadedFile,
  PriceBreakdown,
} from '@/lib/api-client';
import { CheckCircle, Printer, LogIn, LogOut, User, Menu } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/context/auth-context';
import { useCreateOrder } from '@/lib/hooks/use-orders';
import { MobileMenu } from '@/components/mobile-menu';

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const createOrder = useCreateOrder();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  const [options, setOptions] = useState<OrderOptions>({
    size: 'A4',
    isColor: false,
    isDuplex: false,
    quantity: 1,
  });
  const [comment, setComment] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(
    null,
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const uploadFiles = async () => {
      if (selectedFiles.length === 0) return;

      setIsUploading(true);
      try {
        const uploaded: UploadedFile[] = [];
        for (const file of selectedFiles) {
          const result = await apiClient.uploadFile(file);
          uploaded.push(result);
        }
        setUploadedFiles([...uploadedFiles, ...uploaded]);
        setSelectedFiles([]);
      } catch (error) {
        showToast(
          'Error al subir archivos. Por favor intentá de nuevo.',
          'error',
        );
      } finally {
        setIsUploading(false);
      }
    };

    uploadFiles();
  }, [selectedFiles]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (uploadedFiles.length === 0) {
        setPriceBreakdown(null);
        return;
      }

      setIsCalculating(true);
      try {
        const breakdown = await apiClient.calculatePrice(
          uploadedFiles,
          options,
        );
        setPriceBreakdown(breakdown);
      } catch (error) {
        setPriceBreakdown(null);
        showToast(
          'Error al calcular el precio. Por favor intentá de nuevo.',
          'error',
        );
      } finally {
        setIsCalculating(false);
      }
    };

    calculatePrice();
  }, [uploadedFiles, options]);

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada exitosamente', 'success');
  };

  // Validate pickup date and time
  const isPickupValid = () => {
    // If both are provided, validate them
    if (pickupDate && pickupTime) {
      // Parse date in local timezone to avoid UTC conversion issues
      const [year, month, day] = pickupDate.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const dayOfWeek = selectedDate.getDay();

      // Check if it's Sunday (0)
      if (dayOfWeek === 0) {
        return false;
      }

      // Check if date is more than 7 days in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(maxDate.getDate() + 7);

      if (selectedDate > maxDate) {
        return false;
      }

      // Check time range
      const [hours] = pickupTime.split(':').map(Number);
      if (hours < 8 || hours >= 19) {
        return false;
      }
    }
    // If only one is provided, it's invalid
    if ((pickupDate && !pickupTime) || (!pickupDate && pickupTime)) {
      return false;
    }

    return true;
  };

  const canCreateOrder = () => {
    return (
      isAuthenticated &&
      uploadedFiles.length > 0 &&
      !isCreatingOrder &&
      isPickupValid()
    );
  };

  const handleCreateOrder = async () => {
    // Verificar autenticación primero
    if (!isAuthenticated || !user) {
      showToast('Necesitás iniciar sesión para crear un pedido', 'warning');
      router.push('/login?redirect=/');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      showToast(
        'Sesión expirada. Por favor iniciá sesión nuevamente.',
        'warning',
      );
      router.push('/login?redirect=/');
      return;
    }

    if (uploadedFiles.length === 0) {
      showToast('Por favor subí al menos un archivo.', 'warning');
      return;
    }

    // Validate pickup date and time
    if (!isPickupValid()) {
      showToast(
        'Por favor seleccioná una fecha y hora de retiro válida (Lunes a Sábados, 8:00 AM - 7:00 PM, máximo 7 días desde hoy)',
        'warning',
      );
      return;
    }

    setIsCreatingOrder(true);
    try {
      await createOrder.mutateAsync({
        userEmail: user.email,
        options,
        files: uploadedFiles,
        comment: comment.trim() || undefined,
        pickupDate: pickupDate ? new Date(pickupDate).toISOString() : undefined,
        pickupTime: pickupTime || undefined,
      });
      showToast('¡Pedido creado exitosamente!', 'success');
      setOrderSuccess(true);

      // Reset form y redirigir a "Mis Pedidos" después de 3 segundos
      setTimeout(() => {
        setUploadedFiles([]);
        setComment('');
        setPickupDate('');
        setPickupTime('');
        setOptions({
          size: 'A4',
          isColor: false,
          isDuplex: false,
          quantity: 1,
        });
        setOrderSuccess(false);
        router.push('/my-orders');
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      if (errorMessage.includes('Authentication required')) {
        showToast(
          'Sesión expirada. Por favor iniciá sesión nuevamente.',
          'warning',
        );
        router.push('/login?redirect=/');
      } else {
        showToast(
          'Error al crear el pedido. Por favor intentá de nuevo.',
          'error',
        );
      }
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center animate-fadeIn">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pedido enviado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido fue recibido correctamente. Te contactaremos a la brevedad
            al email proporcionado.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo a &quot;Mis Pedidos&quot;...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3">
                <Printer className="h-6 w-6 md:h-8 md:w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h1 className="text-lg md:text-3xl font-bold text-gray-900 truncate">
                    Gráfica
                  </h1>
                  <p className="hidden md:block mt-1 text-sm text-gray-600">
                    Cotización Online
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-900 max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => router.push('/my-orders')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Mis Pedidos</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-medium">Iniciar sesión</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Subtitle */}
          <p className="md:hidden mt-2 text-xs text-gray-600">
            Subí tus archivos y obtené tu presupuesto al instante
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                1. Subí tus archivos
              </h2>
              <UploadForm
                onFilesSelected={setSelectedFiles}
                selectedFiles={selectedFiles}
                onRemoveFile={() => {}}
                isUploading={isUploading}
              />

              {/* Loading skeleton mientras se suben archivos */}
              {isUploading && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Procesando archivos...
                  </h3>
                  <div className="space-y-2">
                    {selectedFiles.map((_, index) => (
                      <div
                        key={`loading-${index}`}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg animate-pulse"
                      >
                        <div className="flex-1">
                          <div className="h-4 bg-blue-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                        </div>
                        <div className="ml-4">
                          <svg
                            className="animate-spin h-5 w-5 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-blue-600 text-center">
                    Subiendo y procesando archivos PDF...
                  </p>
                </div>
              )}

              {/* Archivos subidos exitosamente */}
              {uploadedFiles.length > 0 && !isUploading && (
                <div className="mt-6 animate-slideIn">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-sm font-semibold text-green-700">
                      Archivos listos ({uploadedFiles.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition-shadow animate-slideIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className="h-6 w-6 text-green-600 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.originalName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.pages}{' '}
                              {file.pages === 1 ? 'página' : 'páginas'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Options & Price */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                2. Elegí las opciones
              </h2>
              <PriceCalculator
                options={options}
                onOptionsChange={setOptions}
                priceBreakdown={priceBreakdown}
                isCalculating={isCalculating}
              />
            </div>

            {/* Submit */}
            {uploadedFiles.length > 0 && priceBreakdown && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  3. Confirmá tu pedido
                </h2>
                <div className="space-y-4">
                  {isAuthenticated && user && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                    </div>
                  )}

                  {/* Comentario opcional */}
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Comentarios o indicaciones (opcional)
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Ej: Necesito que estén listas antes del viernes, quiero que los colores sean más intensos, etc."
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-500 text-right">
                      {comment.length}/500 caracteres
                    </p>
                  </div>

                  {/* Pickup Date and Time */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      📅 Fecha y hora de retiro
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Seleccioná cuándo querés retirar tu pedido (Lunes a
                      Sábados, 8:00 AM - 7:00 PM)
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date Picker */}
                      <div>
                        <label
                          htmlFor="pickupDate"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Fecha de retiro
                        </label>
                        <input
                          type="date"
                          id="pickupDate"
                          value={pickupDate}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value
                              .split('-')
                              .map(Number);
                            const selectedDate = new Date(year, month - 1, day);
                            const dayOfWeek = selectedDate.getDay();

                            // Check if it's Sunday (0)
                            if (dayOfWeek === 0) {
                              showToast(
                                'No se puede seleccionar domingos. Por favor elegí un día de lunes a sábado.',
                                'warning',
                              );
                              return;
                            }

                            // Check if date is more than 7 days in the future
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const maxDate = new Date(today);
                            maxDate.setDate(maxDate.getDate() + 7);

                            if (selectedDate > maxDate) {
                              showToast(
                                'Solo podés programar retiros hasta 7 días desde hoy.',
                                'warning',
                              );
                              return;
                            }

                            setPickupDate(e.target.value);
                          }}
                          min={
                            new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split('T')[0]
                          }
                          max={
                            new Date(
                              new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
                            )
                              .toISOString()
                              .split('T')[0]
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{
                            fontSize: '16px',
                            height: '52px',
                          }}
                        />
                      </div>

                      {/* Time Picker */}
                      <div>
                        <label
                          htmlFor="pickupTime"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Hora de retiro
                        </label>
                        <input
                          type="time"
                          id="pickupTime"
                          value={pickupTime}
                          onChange={(e) => {
                            const time = e.target.value;
                            const [hours] = time.split(':').map(Number);

                            // Check if time is between 08:00 and 19:00 (7 PM)
                            if (hours < 8 || hours >= 19) {
                              showToast(
                                'La hora debe ser entre 08:00 y 19:00 (7 PM)',
                                'warning',
                              );
                              return;
                            }

                            setPickupTime(time);
                          }}
                          min="08:00"
                          max="19:00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{
                            fontSize: '16px',
                            height: '52px',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateOrder}
                    disabled={!canCreateOrder()}
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCreatingOrder
                      ? 'Enviando...'
                      : isAuthenticated
                        ? 'Enviar pedido'
                        : 'Iniciar sesión para enviar pedido'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    {isAuthenticated
                      ? 'Al enviar el pedido, recibirás un email de confirmación con los detalles'
                      : 'Necesitás iniciar sesión para crear un pedido'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <p className="text-center text-xs md:text-sm text-gray-600">
            Servicio de impresión digital - Entrega en 24hs hábiles
          </p>
        </div>
      </footer>
    </div>
  );
}
