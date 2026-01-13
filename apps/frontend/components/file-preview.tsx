'use client';

import { UploadedFile } from '@/lib/api-client';
import { FileText, Image as ImageIcon, Download } from 'lucide-react';

interface FilePreviewProps {
  file: UploadedFile;
  showDownload?: boolean;
}

export function FilePreview({ file, showDownload = false }: FilePreviewProps) {
  const isPDF = file.fileName.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png)$/i.test(file.fileName);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const fileUrl = `${API_URL}${file.fileUrl}`;

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {isPDF ? (
            <FileText className="h-10 w-10 text-red-600" />
          ) : isImage ? (
            <ImageIcon className="h-10 w-10 text-blue-600" />
          ) : (
            <FileText className="h-10 w-10 text-gray-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.originalName}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {file.pages} {file.pages === 1 ? 'página' : 'páginas'}
          </p>
        </div>
        {showDownload && (
          <button
            onClick={handleDownload}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Descargar archivo"
          >
            <Download className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
