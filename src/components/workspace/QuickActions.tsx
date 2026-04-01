import React from 'react';
import { FileText, Megaphone, Users, DollarSign, Calendar, BarChart, FileEdit, TrendingUp } from 'lucide-react';

const ACTIONS = [
  { id: 'proposal', icon: FileText, title: 'Event Proposal', subtitle: 'Formal official document' },
  { id: 'flyer', icon: Megaphone, title: 'Flyer Content', subtitle: 'Promotional text ready to design' },
  { id: 'attendance', icon: Users, title: 'Attendance Sheet', subtitle: 'Printable sign-in sheet' },
  { id: 'budget', icon: DollarSign, title: 'Budget Estimate', subtitle: 'Category-wise cost breakdown' },
  { id: 'timeline', icon: Calendar, title: 'Activity Timeline', subtitle: 'Hour-by-hour schedule' },
  { id: 'report', icon: BarChart, title: 'Event Report', subtitle: 'Post-event official report' },
  { id: 'summary', icon: FileEdit, title: 'Quick Summary', subtitle: 'Website and newsletter ready' },
  { id: 'analytics', icon: TrendingUp, title: 'Analytics', subtitle: 'Impact and engagement insights' },
];

interface QuickActionsProps {
  onSelect: (id: string) => void;
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-4">
        {ACTIONS.map((action) => (
          <div
            key={action.id}
            onClick={() => onSelect(action.id)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:border-l-4 hover:border-l-indigo-600 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-100 transition-colors">
              <action.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{action.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
