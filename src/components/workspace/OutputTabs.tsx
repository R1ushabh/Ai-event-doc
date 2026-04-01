import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentCard } from '../documents/DocumentCard';
import { DocumentOutput } from '../../lib/types';

interface OutputTabsProps {
  documents: DocumentOutput[];
  isGenerating: boolean;
  eventDetails: any;
}

const TABS = ['Proposal', 'Flyer', 'Attendance', 'Budget', 'Timeline', 'Report', 'Summary', 'Analytics'];

export function OutputTabs({ documents, isGenerating, eventDetails }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {isGenerating ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-32 bg-gray-200 rounded w-full mt-8"></div>
              </div>
            ) : (
              <DocumentCard 
                document={documents.find(d => d.type.toLowerCase() === activeTab.toLowerCase())} 
                type={activeTab} 
                eventDetails={eventDetails}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
