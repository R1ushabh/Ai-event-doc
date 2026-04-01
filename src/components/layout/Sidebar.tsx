import React from 'react';
import { Zap, LayoutDashboard, PlusCircle, FileText, LayoutTemplate, Download, HelpCircle, Settings, User } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: PlusCircle, label: 'New Event' },
  { icon: FileText, label: 'Documents' },
  { icon: LayoutTemplate, label: 'Templates' },
  { icon: Download, label: 'Downloads' },
  { icon: HelpCircle, label: 'Help' },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <Zap size={24} />
        </div>
        <span className="font-bold text-xl text-gray-900">EventForge AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, index) => (
          <motion.button
            key={item.label}
            onClick={() => onViewChange(item.label)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.label 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </motion.button>
        ))}

        <div className="mt-8 mb-4 px-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Events</h3>
          <div className="mt-3 space-y-2">
            {['AI Workshop 2026', 'Tech Symposium', 'Alumni Meet'].map((event) => (
              <a key={event} href="#" className="block text-sm text-gray-600 hover:text-indigo-600 truncate">
                {event}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <button 
          onClick={() => onViewChange('Settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'Settings' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings size={18} />
          Settings
        </button>
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Jane Doe</span>
            <span className="text-xs text-gray-500">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
