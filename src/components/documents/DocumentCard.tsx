import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import { DocumentOutput } from '../../lib/types';
import { ExportMenu } from './ExportMenu';
import { DocumentRenderer } from './DocumentRenderer';

interface DocumentCardProps {
  document?: DocumentOutput;
  type: string;
  eventDetails?: any;
}

export function DocumentCard({ document, type, eventDetails }: DocumentCardProps) {
  const [copied, setCopied] = useState(false);

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <FileText size={48} className="mb-4 opacity-20" />
        <p>No {type.toLowerCase()} generated yet.</p>
        <p className="text-sm mt-1">Fill out the event details and click generate.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
        <h3 className="font-semibold text-gray-900">{document.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <ExportMenu documentId={document.metadata?.id} />
        </div>
      </div>
      <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
        <DocumentRenderer type={type} content={document.content} eventDetails={eventDetails} />
      </div>
    </div>
  );
}
