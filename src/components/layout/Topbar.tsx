import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, documents..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 cursor-pointer hover:border-indigo-500 transition-colors">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
