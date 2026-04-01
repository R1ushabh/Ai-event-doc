import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { EventDetails } from '../../lib/types';

interface EventInputCardProps {
  onGenerate: (data: string | EventDetails, isStructured: boolean, selectedDocs: string[]) => void;
  isGenerating: boolean;
}

const DOC_TYPES = [
  'Proposal', 'Flyer', 'Attendance', 'Budget', 
  'Timeline', 'Report', 'Summary', 'Analytics'
];

export function EventInputCard({ onGenerate, isGenerating }: EventInputCardProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'form'>('paste');
  const [rawText, setRawText] = useState('');
  const [formData, setFormData] = useState<Partial<EventDetails>>({});
  const [selectedDocs, setSelectedDocs] = useState<string[]>(DOC_TYPES);

  const handleGenerate = () => {
    if (activeTab === 'paste') {
      onGenerate(rawText, false, selectedDocs);
    } else {
      onGenerate(formData as EventDetails, true, selectedDocs);
    }
  };

  const toggleDoc = (doc: string) => {
    setSelectedDocs(prev => 
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  const selectAll = () => setSelectedDocs(DOC_TYPES);
  const selectNone = () => setSelectedDocs([]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
      <div className="flex border-b border-gray-100 bg-gray-50/30">
        <button
          className={`flex-1 py-4 text-sm font-semibold transition-all ${
            activeTab === 'paste' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('paste')}
        >
          Quick Paste
        </button>
        <button
          className={`flex-1 py-4 text-sm font-semibold transition-all ${
            activeTab === 'form' 
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('form')}
        >
          Structured Form
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'paste' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Description</label>
            <textarea
              className="w-full min-h-[180px] p-5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-y leading-relaxed"
              placeholder="Describe your event in natural language. For example: 'We are hosting a 3-day Tech Summit starting June 12th at the Grand Ballroom. We expect 500 developers and will have 10 keynote speakers...'"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {['event_name', 'event_type', 'date', 'time', 'venue', 'organizer', 'department', 'speaker', 'theme', 'target_audience', 'expected_participants', 'activities', 'budget_preference', 'event_mode'].map((field) => (
              <div key={field} className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type={field === 'expected_participants' ? 'number' : 'text'}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder={`Enter ${field.replace('_', ' ')}`}
                  value={(formData as any)[field] || ''}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Documents to Generate
            </h3>
            <div className="flex gap-3">
              <button onClick={selectAll} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-tighter">Select All</button>
              <button onClick={selectNone} className="text-[10px] font-bold text-gray-400 hover:underline uppercase tracking-tighter">Clear</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {DOC_TYPES.map(doc => (
              <button
                key={doc}
                onClick={() => toggleDoc(doc)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedDocs.includes(doc)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {doc}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || (activeTab === 'paste' ? !rawText : !formData.event_name) || selectedDocs.length === 0}
          className="w-full mt-10 flex items-center justify-center gap-3 py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isGenerating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {isGenerating ? 'AI is crafting your documents...' : 'Generate Professional Documents'}
        </motion.button>
      </div>
    </div>
  );
}
