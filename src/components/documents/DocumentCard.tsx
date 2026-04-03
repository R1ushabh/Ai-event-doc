import React from 'react';
import { DocumentOutput } from '../../lib/types';

interface DocumentCardProps {
  output: DocumentOutput;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ output }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">{output.title}</h3>
      <div className="prose max-w-none whitespace-pre-wrap">
        {output.content}
      </div>
    </div>
  );
};
