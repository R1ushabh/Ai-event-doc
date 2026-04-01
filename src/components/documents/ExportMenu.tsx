import React, { useState } from 'react';
import { Download, FileText, File as FilePdf, Table } from 'lucide-react';
import { api } from '../../lib/api';

interface ExportMenuProps {
  documentId?: string;
}

export function ExportMenu({ documentId }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!documentId) return null;

  const handleExport = (type: 'docx' | 'pdf' | 'csv') => {
    window.open(api.getExportUrl(type, documentId), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
      >
        <Download size={14} />
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1">
          <button
            onClick={() => handleExport('docx')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FileText size={16} className="text-blue-600" />
            Word Document (.docx)
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FilePdf size={16} className="text-red-600" />
            PDF Document (.pdf)
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Table size={16} className="text-green-600" />
            CSV Spreadsheet (.csv)
          </button>
        </div>
      )}
    </div>
  );
}
