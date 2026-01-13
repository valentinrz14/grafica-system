'use client';

import { useState, useEffect } from 'react';
import { UploadForm } from '@/components/upload-form';
import { PriceCalculator } from '@/components/price-calculator';
import {
  apiClient,
  OrderOptions,
  UploadedFile,
  PriceBreakdown,
} from '@/lib/api-client';
import { CheckCircle, Printer } from 'lucide-react';

export default function HomePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [options, setOptions] = useState<OrderOptions>({
    size: 'A4',
    isColor: false,
    isDuplex: false,
    quantity: 1,
  });
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(
    null,
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Auto-upload files when selected
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
        console.error('Error uploading files:', error);
        alert('Error al subir archivos. Por favor intentá de nuevo.');
      } finally {
        setIsUploading(false);
      }
    };

    uploadFiles();
  }, [selectedFiles]);

  // Auto-calculate price when files or options change
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
        console.error('Error calculating price:', error);
        setPriceBreakdown(null);
        alert(
          'Error al calcular el precio. Por favor intentá de nuevo o contactá a soporte.',
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

  const handleCreateOrder = async () => {
    if (!email || uploadedFiles.length === 0) {
      alert('Por favor ingresá tu email y subí al menos un archivo.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Por favor ingresá un email válido.');
      return;
    }

    setIsCreatingOrder(true);
    try {
      await apiClient.createOrder({
        userEmail: email,
        options,
        files: uploadedFiles,
      });
      setOrderSuccess(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setUploadedFiles([]);
        setEmail('');
        setOptions({
          size: 'A4',
          isColor: false,
          isDuplex: false,
          quantity: 1,
        });
        setOrderSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al crear el pedido. Por favor intentá de nuevo.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pedido enviado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido fue recibido correctamente. Te contactaremos a la brevedad
            al email proporcionado.
          </p>
          <p className="text-sm text-gray-500">
            Redirigiendo en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Printer className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Gráfica - Cotización Online
            </h1>
          </div>
          <p className="mt-2 text-gray-600">
            Subí tus archivos, elegí las opciones y obtené tu presupuesto al
            instante
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                1. Subí tus archivos
              </h2>
              <UploadForm
                onFilesSelected={setSelectedFiles}
                selectedFiles={selectedFiles}
                onRemoveFile={() => {}}
                isUploading={isUploading}
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Archivos listos ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.pages}{' '}
                            {file.pages === 1 ? 'página' : 'páginas'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
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
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                2. Elegí las opciones
              </h2>
              <PriceCalculator
                options={options}
                onOptionsChange={setOptions}
                priceBreakdown={priceBreakdown}
                isCalculating={isCalculating}
              />
            </div>

            {/* Email & Submit */}
            {uploadedFiles.length > 0 && priceBreakdown && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  3. Confirmá tu pedido
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tu email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="[email protected]"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder || !email}
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCreatingOrder ? 'Enviando...' : 'Enviar pedido'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Al enviar el pedido, recibirás un email de confirmación con
                    los detalles
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Servicio de impresión digital - Entrega en 24hs hábiles
          </p>
        </div>
      </footer>
    </div>
  );
}
