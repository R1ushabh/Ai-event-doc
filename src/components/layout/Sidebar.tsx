import React from 'react';
import { 
  Zap, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Layout, 
  Download, 
  HelpCircle, 
  Settings,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: PlusCircle, label: 'New Event' },
  { icon: FileText, label: 'Documents' },
  { icon: Layout, label: 'Templates' },
  { icon: Download, label: 'Downloads' },
  { icon: HelpCircle, label: 'Help' },
];

const recentEvents = [
  "AI Workshop 2026",
  "Annual Tech Fest",
  "CSE Dept Seminar"
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="font-bold text-xl text-gray-900 tracking-tight">EventForge AI</span>
      </div>

      <nav className="flex-1 px-4 py-2">
        <motion.ul 
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.04
              }
            }
          }}
          className="space-y-1"
        >
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <a
                href="#"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Recent Events
          </h3>
          <ul className="space-y-1">
            {recentEvents.map((event, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg truncate"
                >
                  {event}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
