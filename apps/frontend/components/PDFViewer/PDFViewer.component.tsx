'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

export function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [rendering, setRendering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import pdfjs-dist only on client
        const pdfjs = await import('pdfjs-dist');

        // Configure worker with correct path
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

        // Suppress font warnings
        const originalConsoleWarn = console.warn;
        console.warn = function (...args: any[]) {
          if (
            args[0] &&
            typeof args[0] === 'string' &&
            args[0].includes('Cannot load system font')
          ) {
            // Suppress font warnings
            return;
          }
          originalConsoleWarn.apply(console, args);
        };

        // Load PDF document with standard fonts disabled to avoid warnings
        const loadingTask = pdfjs.getDocument({
          url: fileUrl,
          standardFontDataUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
        });
        const pdf = await loadingTask.promise;

        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        if (isMounted) {
          setError('Error al cargar el PDF');
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [fileUrl]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocRef.current || !canvasRef.current) return;

      try {
        // Cancel previous render task if any
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        setRendering(true);
        setError(null);

        const page = await pdfDocRef.current.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Calculate scale to fit the container width while maintaining aspect ratio
        const containerWidth = canvas.parentElement?.clientWidth || 800;
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(containerWidth / viewport.width, 2.5);
        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
        renderTaskRef.current = null;
        setRendering(false);
      } catch (err: any) {
        if (err.name === 'RenderingCancelledException') {
          // Ignore cancelled renders
          return;
        }
        console.error('Error rendering page:', err);
        setError('Error al renderizar la página');
        setRendering(false);
      }
    };

    if (pdfDocRef.current && currentPage && !loading) {
      renderPage();
    }
  }, [currentPage, loading]);

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Cargando PDF...
          </p>
          <p className="text-sm text-gray-600">
            Esto puede tomar unos segundos
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-900 mb-2">{error}</p>
          <p className="text-sm text-red-600">
            Por favor intentá recargar el archivo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* PDF Info Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-4 border-b-2 border-gray-200 bg-white rounded-lg p-4 shadow-sm gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 truncate max-w-md">
              {fileName}
            </p>
            <p className="text-sm text-gray-600">
              {numPages} {numPages === 1 ? 'página' : 'páginas'} en total
            </p>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || rendering}
            className="p-2 rounded-lg bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="Página anterior"
            title="Página anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm font-bold text-gray-900 min-w-[100px] text-center px-3">
            Página {currentPage} / {numPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(numPages, prev + 1))
            }
            disabled={currentPage === numPages || rendering}
            className="p-2 rounded-lg bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-4 relative overflow-auto">
        {rendering && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
              <p className="text-sm font-medium text-gray-900">
                Renderizando página {currentPage}...
              </p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="shadow-2xl max-w-full h-auto rounded-lg bg-white"
          style={{ opacity: rendering ? 0.3 : 1 }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-xs text-gray-500 bg-blue-50 rounded-lg p-2">
        💡 Usá las flechas o presiona ESC para cerrar
      </div>
    </div>
  );
}
