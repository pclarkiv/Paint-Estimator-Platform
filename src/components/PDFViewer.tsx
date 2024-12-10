'use client';

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  scale?: number;
}

export default function PDFViewer({ url, scale = 1.5 }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [url]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (error) {
        console.error('Error rendering PDF page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  const changePage = (delta: number) => {
    setCurrentPage((prev) => {
      const newPage = prev + delta;
      return newPage >= 1 && newPage <= numPages ? newPage : prev;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas ref={canvasRef} className="border border-base-300 rounded-lg shadow-lg" />
      </div>
      {numPages > 1 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1}
            className="btn btn-primary btn-sm"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={currentPage >= numPages}
            className="btn btn-primary btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
