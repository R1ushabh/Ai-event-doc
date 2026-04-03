import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileCode, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportMenuProps {
  onPrint: () => void;
  onDownloadTxt: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ onPrint, onDownloadTxt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
      >
        <Download className="w-3.5 h-3.5" />
        Export
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="p-1">
              <button
                onClick={() => { onPrint(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <FileType className="w-4 h-4 text-gray-400" />
                Download PDF
              </button>
              <button
                onClick={() => { onDownloadTxt(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                Download TXT
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                <FileCode className="w-4 h-4 text-gray-400" />
                Download JSON
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportMenu;
