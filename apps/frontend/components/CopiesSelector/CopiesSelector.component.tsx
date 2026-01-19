'use client';

import { useState } from 'react';
import { Copy, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export interface PageCopy {
  pageNumber: number;
  copies: number;
  included: boolean;
}

export interface CopiesSelectorProps {
  totalPages: number;
  onCopiesChange: (config: {
    mode: 'document' | 'individual';
    documentCopies?: number;
    pageCopies?: PageCopy[];
  }) => void;
  onPreviewPage?: (pageNumber: number) => void;
}

export function CopiesSelector({
  totalPages,
  onCopiesChange,
  onPreviewPage,
}: CopiesSelectorProps) {
  const [mode, setMode] = useState<'document' | 'individual'>('document');
  const [documentCopies, setDocumentCopies] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pageCopies, setPageCopies] = useState<PageCopy[]>(
    Array.from({ length: totalPages }, (_, i) => ({
      pageNumber: i + 1,
      copies: 1,
      included: true,
    })),
  );

  const handleModeChange = (newMode: 'document' | 'individual') => {
    setMode(newMode);
    if (newMode === 'document') {
      onCopiesChange({ mode: 'document', documentCopies });
    } else {
      onCopiesChange({ mode: 'individual', pageCopies });
    }
  };

  const handleDocumentCopiesChange = (copies: number) => {
    setDocumentCopies(copies);
    onCopiesChange({ mode: 'document', documentCopies: copies });
  };

  const handlePageCopyChange = (pageNumber: number, copies: number) => {
    const newPageCopies = pageCopies.map((pc) =>
      pc.pageNumber === pageNumber ? { ...pc, copies } : pc,
    );
    setPageCopies(newPageCopies);
    onCopiesChange({ mode: 'individual', pageCopies: newPageCopies });
  };

  const handlePageIncludedChange = (pageNumber: number, included: boolean) => {
    const newPageCopies = pageCopies.map((pc) =>
      pc.pageNumber === pageNumber ? { ...pc, included } : pc,
    );
    setPageCopies(newPageCopies);
    onCopiesChange({ mode: 'individual', pageCopies: newPageCopies });
  };

  const getTotalPagesFromIndividual = () => {
    return pageCopies
      .filter((pc) => pc.included)
      .reduce((sum, pc) => sum + pc.copies, 0);
  };

  const getTotalPages = () => {
    if (mode === 'document') {
      return totalPages * documentCopies;
    }
    return getTotalPagesFromIndividual();
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-200 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <Copy className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Configurar copias
        </h3>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        {/* Document Mode */}
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            mode === 'document'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleModeChange('document')}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              checked={mode === 'document'}
              onChange={() => handleModeChange('document')}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">
                Copias del documento completo
              </p>
              {mode === 'document' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700">Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={documentCopies}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 100) {
                          handleDocumentCopiesChange(value);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                      style={{ color: '#111827' }}
                    />
                  </div>
                  <p className="text-sm text-blue-700 bg-blue-100 rounded p-2">
                    → {totalPages} páginas × {documentCopies}{' '}
                    {documentCopies === 1 ? 'copia' : 'copias'} ={' '}
                    <span className="font-bold">
                      {totalPages * documentCopies} páginas
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Individual Mode */}
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            mode === 'individual'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => {
            if (mode !== 'individual') {
              handleModeChange('individual');
            }
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              checked={mode === 'individual'}
              onChange={() => handleModeChange('individual')}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">
                  Copias personalizadas por página
                </p>
                {mode === 'individual' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                )}
              </div>

              {mode === 'individual' && isExpanded && (
                <div className="mt-3 space-y-2">
                  {pageCopies.map((pc) => (
                    <div
                      key={pc.pageNumber}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        pc.included
                          ? 'bg-white border-gray-200'
                          : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={pc.included}
                        onChange={(e) =>
                          handlePageIncludedChange(
                            pc.pageNumber,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                      />
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 min-w-[80px]">
                        Página {pc.pageNumber}:
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={pc.copies}
                        disabled={!pc.included}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 1 && value <= 100) {
                            handlePageCopyChange(pc.pageNumber, value);
                          }
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm text-gray-900 font-medium"
                        style={{ color: pc.included ? '#111827' : '#6B7280' }}
                      />
                      <span className="text-xs text-gray-600">
                        {pc.copies === 1 ? 'copia' : 'copias'}
                      </span>
                      {onPreviewPage && (
                        <button
                          onClick={() => onPreviewPage(pc.pageNumber)}
                          className="ml-auto px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Ver
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-sm text-blue-700 bg-blue-100 rounded p-2 mt-3">
                    → Total:{' '}
                    <span className="font-bold">
                      {getTotalPagesFromIndividual()} páginas
                    </span>
                  </p>
                </div>
              )}

              {mode === 'individual' && !isExpanded && (
                <p className="text-sm text-gray-600 mt-2">
                  Click para configurar copias por página
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
        <p className="text-sm font-semibold text-gray-900">
          📊 Total de páginas a imprimir:{' '}
          <span className="text-blue-600 text-lg">{getTotalPages()}</span>{' '}
          {getTotalPages() === 1 ? 'página' : 'páginas'}
        </p>
      </div>
    </div>
  );
}
