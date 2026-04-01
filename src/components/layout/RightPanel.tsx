import React from 'react';
import { CheckCircle2, Circle, Download, FileText, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RightPanelProps {
  eventSummary: Record<string, any> | null;
  generatedDocs: string[];
}

const ALL_DOC_TYPES = [
  'proposal', 'flyer', 'attendance', 'budget', 
  'timeline', 'report', 'summary', 'analytics'
];

export function RightPanel({ eventSummary, generatedDocs }: RightPanelProps) {
  return (
    <div className="w-[320px] h-screen bg-white border-l border-gray-200 flex flex-col overflow-y-auto sticky top-0">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          Event Snapshot
        </h2>
        {eventSummary ? (
          <div className="space-y-5">
            {Object.entries(eventSummary).map(([key, value]) => {
              if (!value || key === 'raw_description' || Array.isArray(value)) return null;
              return (
                <div key={key} className="group">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter block mb-1 group-hover:text-indigo-600 transition-colors">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-900 font-semibold leading-tight block">
                    {String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-500 italic">
              No event details extracted yet.
            </p>
          </div>
        )}
      </div>

      <div className="p-8 border-b border-gray-100">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
          Generation Status
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {ALL_DOC_TYPES.map((type) => {
            const isGenerated = generatedDocs.includes(type);
            return (
              <div key={type} className={`flex items-center justify-between p-2 rounded-lg transition-all ${isGenerated ? 'bg-green-50/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isGenerated ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-gray-200'}`}></div>
                  <span className={`text-xs font-bold capitalize ${isGenerated ? 'text-gray-900' : 'text-gray-400'}`}>
                    {type}
                  </span>
                </div>
                {isGenerated && (
                  <CheckCircle2 size={14} className="text-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8 mt-auto bg-gray-50/50">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Workspace Actions
        </h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <Download size={14} />
            Download All (ZIP)
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all">
            <Share2 size={14} />
            Share Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
