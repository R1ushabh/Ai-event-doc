import React from 'react';
import { Search, Bell, ChevronRight } from 'lucide-react';

interface TopbarProps {
  activeView: string;
}

export function Topbar({ activeView }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center text-sm text-gray-500">
        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Workspace</span>
        <ChevronRight size={14} className="mx-2 opacity-50" />
        <span className="font-bold text-gray-900">{activeView}</span>
      </div>

      <div className="flex-1 max-w-lg mx-12">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search documents, events, or templates..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-indigo-600 relative transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-gray-100"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
