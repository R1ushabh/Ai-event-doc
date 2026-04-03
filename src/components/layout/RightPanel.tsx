import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Download, 
  Share2,
  FileText,
  Calendar,
  MapPin,
  Users,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventDetails, AgentState, AgentStatus } from '../../lib/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RightPanelProps {
  details: EventDetails | null;
  agents: AgentState[];
}

const RightPanel: React.FC<RightPanelProps> = ({ details, agents }) => {
  return (
    <aside className="w-[300px] h-screen bg-white border-l border-gray-200 flex flex-col fixed right-0 top-0 z-50 overflow-y-auto">
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          Event Snapshot
        </h3>

        <div className="space-y-4">
          {details ? (
            <>
              <SnapshotItem icon={FileText} label="Event" value={details.event_name} />
              <SnapshotItem icon={Calendar} label="Date" value={details.date || 'TBD'} />
              <SnapshotItem icon={MapPin} label="Venue" value={details.venue || 'TBD'} />
              <SnapshotItem icon={Users} label="Target" value={details.target_audience || 'TBD'} />
            </>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-500">No event details extracted yet.</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Loader2 className={cn("w-4 h-4 text-indigo-600", agents.some(a => a.status === 'processing') && "animate-spin")} />
            Agent Status
          </h3>

          <div className="space-y-4">
            {agents.map((agent, index) => (
              <AgentStatusRow key={index} agent={agent} />
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export All (ZIP)
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            Share Workspace
          </button>
        </div>
      </div>
    </aside>
  );
};

const SnapshotItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-indigo-600" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-900 font-medium truncate">{value}</p>
    </div>
  </div>
);

const AgentStatusRow = ({ agent }: { agent: AgentState }) => {
  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'processing': return <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />;
      case 'done': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-200" />;
    }
  };

  return (
    <motion.div 
      layout
      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
    >
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-900">{agent.name}</span>
        <span className="text-[10px] text-gray-500 truncate max-w-[140px]">
          {agent.docs.join(', ')}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={agent.status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getStatusIcon(agent.status)}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default RightPanel;
