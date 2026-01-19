'use client';

import { useState } from 'react';
import { FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
  mimeType?: string;
  pages: number;
}

export function FilePreview({
  fileUrl,
  fileName,
  mimeType,
  pages,
}: FilePreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isPDF =
    mimeType?.includes('pdf') || fileName.toLowerCase().endsWith('.pdf');
  const isImage =
    mimeType?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(fileName);

  // Para PDFs - mostrar solo icono
  if (isPDF) {
    return (
      <div className="w-12 h-12 flex items-center justify-center bg-blue-50 border border-blue-200 rounded">
        <FileText className="w-6 h-6 text-blue-600" />
      </div>
    );
  }

  // Para imágenes
  if (isImage) {
    return (
      <div className="relative w-12 h-12 flex-shrink-0">
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-red-50 border border-red-200 rounded">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 border border-gray-200 rounded animate-pulse">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <img
              src={fileUrl}
              alt={fileName}
              className="w-full h-full object-cover rounded border border-gray-200 shadow-sm"
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Error al cargar imagen');
                setLoading(false);
              }}
            />
          </>
        )}
      </div>
    );
  }

  // Fallback para archivos no reconocidos
  return (
    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 border border-gray-200 rounded">
      <FileText className="w-6 h-6 text-gray-600" />
    </div>
  );
}
