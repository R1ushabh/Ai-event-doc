import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { RightPanel } from './components/layout/RightPanel';
import { HeroSection } from './components/workspace/HeroSection';
import { EventInputCard } from './components/workspace/EventInputCard';
import { QuickActions } from './components/workspace/QuickActions';
import { OutputTabs } from './components/workspace/OutputTabs';
import { api } from './lib/api';
import { EventDetails, DocumentOutput } from './lib/types';
import { LayoutDashboard, PlusCircle, FileText, LayoutTemplate, Download, HelpCircle, Settings, CheckCircle2, Circle, Share2, Star, Heart, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState('New Event');
  const [isGenerating, setIsGenerating] = useState(false);
  const [eventSummary, setEventSummary] = useState<Record<string, any> | null>(null);
  const [documents, setDocuments] = useState<DocumentOutput[]>([]);

  const handleGenerate = async (data: string | EventDetails, isStructured: boolean, selectedDocs: string[]) => {
    setIsGenerating(true);
    try {
      let eventDetails: EventDetails;
      if (!isStructured) {
        eventDetails = await api.extractEvent(data as string);
      } else {
        eventDetails = data as EventDetails;
      }
      
      setEventSummary(eventDetails);

      const response = await api.generateAll(eventDetails, selectedDocs.map(d => d.toLowerCase()));
      setDocuments(response.documents);
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(error.response?.data?.error || error.message || 'Failed to generate documents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickAction = async (id: string) => {
    if (!eventSummary) {
      alert('Please enter event details first.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const doc = await api.generateSingle(eventSummary as EventDetails, id);
      setDocuments(prev => {
        const existing = prev.filter(d => d.type !== id);
        return [...existing, doc];
      });
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`Failed to generate ${id}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'Overview':
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Project Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold text-indigo-600">1</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500">Documents Generated</p>
                <p className="text-2xl font-bold text-indigo-600">{documents.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500">Time Saved</p>
                <p className="text-2xl font-bold text-indigo-600">~4.5 hrs</p>
              </div>
            </div>
            {eventSummary && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Current Event: {eventSummary.title}</h2>
                <p className="text-gray-600">{eventSummary.description}</p>
              </div>
            )}
          </div>
        );
      case 'Documents':
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            {documents.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No documents generated yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map(doc => (
                  <div key={doc.metadata?.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{doc.type}</p>
                    </div>
                    <button 
                      onClick={() => setView('New Event')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'Templates':
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Templates</h1>
                <p className="text-gray-500 mt-1">Pre-configured styles for your event documents.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                <PlusCircle size={18} />
                Create Custom Template
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Corporate Minimalist', desc: 'Clean, professional design for business conferences.', icon: FileText, color: 'indigo' },
                { name: 'Vibrant Festival', desc: 'High-energy, colorful layout for music and arts events.', icon: Zap, color: 'orange' },
                { name: 'Elegant Gala', desc: 'Sophisticated serif typography for formal gatherings.', icon: Star, color: 'amber' },
                { name: 'Tech Modern', desc: 'Sleek, dark-mode inspired design for startups.', icon: LayoutDashboard, color: 'blue' },
                { name: 'Academic Formal', desc: 'Structured, citation-ready layout for symposiums.', icon: HelpCircle, color: 'emerald' },
                { name: 'Charity Impact', desc: 'Focus on storytelling and visual impact for non-profits.', icon: Heart, color: 'rose' }
              ].map((t, i) => (
                <motion.div 
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                    t.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' :
                    t.color === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' :
                    t.color === 'amber' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white' :
                    t.color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                    t.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                    'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
                  }`}>
                    <t.icon size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{t.desc}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium</span>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Preview</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'Downloads':
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Downloads</h1>
            <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
              <Download size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No downloads available yet. Generate documents to see them here.</p>
            </div>
          </div>
        );
      case 'Help':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Help & Documentation</h1>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">How to use EventForge AI?</h2>
                <p className="text-gray-600">Simply paste your event description or fill out the structured form. Click "Generate" and our AI will craft all necessary documents for you.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Can I export documents?</h2>
                <p className="text-gray-600">Yes! You can export any generated document to DOCX, PDF, or CSV formats using the export menu on each document card.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Is my data secure?</h2>
                <p className="text-gray-600">We use industry-standard encryption and your data is processed securely via the Gemini API.</p>
              </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle between light and dark themes.</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Auto-Save</h3>
                  <p className="text-sm text-gray-500">Automatically save generated documents to your history.</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-600">Clear All Data</h3>
                  <p className="text-sm text-gray-500">Permanently delete all your generated documents and history.</p>
                </div>
                <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">Clear</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-5xl mx-auto">
            <HeroSection />
            <EventInputCard onGenerate={handleGenerate} isGenerating={isGenerating} />
            <QuickActions onSelect={handleQuickAction} />
            <OutputTabs documents={documents} isGenerating={isGenerating} eventDetails={eventSummary} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar activeView={view} onViewChange={setView} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar activeView={view} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
      <RightPanel 
        eventSummary={eventSummary} 
        generatedDocs={documents.map(d => d.type.toLowerCase())} 
      />
    </div>
  );
}
