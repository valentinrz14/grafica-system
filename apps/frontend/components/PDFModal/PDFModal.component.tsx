'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  children: React.ReactNode;
}

export function PDFModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  children,
}: PDFModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full h-full sm:h-[95vh] sm:max-w-7xl overflow-hidden flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
            📄 Vista previa: {fileName}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
            aria-label="Cerrar (ESC)"
            title="Cerrar (ESC)"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
      </div>
    </div>
  );
}
