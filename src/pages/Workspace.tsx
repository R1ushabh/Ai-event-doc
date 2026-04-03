import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  PieChart, 
  Clock, 
  Download, 
  Copy,
  CheckCircle2,
  Loader2,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Orchestrator, OrchestratorEvent } from '@/ai/orchestrator';
import { EventInput, DocType, DocumentOutput } from '@/ai/types';
import { DocumentRenderer } from '@/components/documents/DocumentRenderer';
import { cn } from '@/lib/utils';

const DOC_TYPES: { id: DocType; label: string; icon: React.ElementType }[] = [
  { id: 'proposal', label: 'Proposal', icon: FileText },
  { id: 'flyer', label: 'Flyer', icon: ImageIcon },
  { id: 'budget', label: 'Budget', icon: PieChart },
  { id: 'timeline', label: 'Timeline', icon: Clock },
];

export default function Workspace() {
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState('');
  const [requestedDocs, setRequestedDocs] = useState<DocType[]>(['proposal', 'flyer']);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [generatedDocs, setGeneratedDocs] = useState<DocumentOutput[]>([]);
  const [activeTab, setActiveTab] = useState<DocType | null>(null);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggleDoc = (docId: DocType) => {
    setRequestedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedDocs([]);
    setActiveTab(null);
    setProgress('Initializing AI Agents...');

    const input: EventInput = {
      prompt,
      theme: theme || 'Professional and standard',
      requestedDocs
    };

    const orchestrator = new Orchestrator((event: OrchestratorEvent) => {
      if (event.type === 'agent_start') {
        setProgress(`Agent working: ${event.agent}...`);
      } else if (event.type === 'document_done') {
        setProgress(`Generated: ${event.docType}`);
      } else if (event.type === 'generation_complete') {
        setProgress('Finalizing documents...');
      }
    });

    try {
      const { docs } = await orchestrator.run(input);
      setGeneratedDocs(docs);
      if (docs.length > 0) {
        setActiveTab(docs[0].type);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setProgress('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeDoc = generatedDocs.find(d => d.type === activeTab);

  const handlePrint = async () => {
    console.log("handlePrint called. activeTab:", activeTab);
    console.log("generatedDocs count:", generatedDocs.length);
    
    if (!activeDoc) {
      console.warn("No active document found to print.");
      return;
    }
    
    console.log("Starting PDF export for:", activeDoc.type, "Title:", activeDoc.title);
    try {
      const payload = {
        type: activeDoc.type,
        title: `${activeDoc.type.charAt(0).toUpperCase() + activeDoc.type.slice(1)} - ${theme || 'Event'}`,
        content: activeDoc.content,
        template_id: 'custom'
      };
      console.log("Sending payload to /api/store:", payload);

      // 1. Store the document in the backend to get an ID for export
      const storeResponse = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!storeResponse.ok) {
        const errorText = await storeResponse.text();
        throw new Error(`Failed to store document: ${errorText}`);
      }
      
      const storedDoc = await storeResponse.json();
      const docId = storedDoc.metadata?.id;
      
      if (!docId) throw new Error('No document ID returned from server');
      
      console.log("Document stored with ID:", docId);
      
      // 2. Trigger download from the export endpoint
      // Using window.location.href is often more reliable than link.click() in some sandboxed environments
      const downloadUrl = `/api/export/pdf/${docId}`;
      window.location.href = downloadUrl;
      
    } catch (error) {
      console.error("PDF Export failed:", error);
      // Fallback to window.print() if backend fails
      window.print();
    }
  };

  const handleCopyRichText = () => {
    const docElement = contentRef.current;
    if (!docElement) return;

    // Create a temporary contenteditable div to copy rich text
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = 'true';
    tempDiv.innerHTML = docElement.innerHTML;
    document.body.appendChild(tempDiv);
    
    // Select and copy
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    
    document.execCommand('copy');
    
    document.body.removeChild(tempDiv);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden font-sans text-gray-900">
      
      {/* LEFT SIDEBAR - PROMPT & SETTINGS (Hidden when printing) */}
      <aside className="w-[400px] bg-white border-r border-gray-200 flex flex-col shrink-0 print:hidden z-10 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight">EventForge AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">1. Describe your event</Label>
            <Textarea 
              placeholder="e.g., Our college is hosting a 2-day hackathon for 500 students. We have a budget of $5000 and need sponsors."
              className="min-h-[160px] resize-none text-base p-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all rounded-xl shadow-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              2. Custom Theme / Vibe
            </Label>
            <Input 
              placeholder="e.g., Pokemon theme, Cyberpunk, Elegant Corporate"
              className="h-12 text-base px-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all rounded-xl shadow-sm"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
            <p className="text-[11px] text-gray-400 font-medium">The AI will heavily adapt the vocabulary and style to this theme.</p>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500">3. Documents to Generate</Label>
            <div className="grid grid-cols-2 gap-3">
              {DOC_TYPES.map((doc) => {
                const Icon = doc.icon;
                const isSelected = requestedDocs.includes(doc.id);
                return (
                  <div 
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      isSelected 
                        ? "border-purple-600 bg-purple-50 text-purple-900 shadow-sm" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <Checkbox checked={isSelected} onCheckedChange={() => handleToggleDoc(doc.id)} className={cn(isSelected && "border-purple-600 bg-purple-600 text-white")} />
                    <Icon className={cn("w-4 h-4", isSelected ? "text-purple-600" : "text-gray-400")} />
                    <span className="text-sm font-semibold">{doc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || requestedDocs.length === 0}
            className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700 text-white transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Documents
              </>
            )}
          </Button>
          {isGenerating && (
            <p className="text-center text-xs font-medium text-purple-600 mt-3 animate-pulse">
              {progress}
            </p>
          )}
        </div>
      </aside>

      {/* RIGHT MAIN AREA - PREVIEW */}
      <main className="flex-1 flex flex-col relative bg-gray-100/50 print:bg-white print:absolute print:inset-0 print:w-full print:h-full">
        
        {generatedDocs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center print:hidden">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FileText className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your Workspace is Empty</h2>
            <p className="text-gray-500 max-w-md mb-8">Describe your event on the left, pick a theme, and let the AI generate professional, ready-to-export documents instantly.</p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <BadgeSuggestion text="Try: A college hackathon with a retro 80s theme" onClick={() => {
                setPrompt("Our college is hosting a 2-day hackathon for 500 students. We have a budget of $5000 and need sponsors.");
                setTheme("Retro 80s Arcade");
              }} />
              <BadgeSuggestion text="Try: A Pokemon themed birthday party" onClick={() => {
                setPrompt("A birthday party for a 10-year old who loves Pokemon. We need a flyer and a timeline.");
                setTheme("Pokemon Adventure");
                setRequestedDocs(['flyer', 'timeline']);
              }} />
            </div>
          </div>
        ) : (
          <>
            {/* Top Bar - Tabs & Actions (Hidden when printing) */}
            <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 print:hidden shadow-sm z-10">
              <div className="flex gap-1">
                {generatedDocs.map(doc => {
                  const config = DOC_TYPES.find(d => d.id === doc.type);
                  const Icon = config?.icon || FileText;
                  const isActive = activeTab === doc.type;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setActiveTab(doc.type)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        isActive 
                          ? "bg-purple-100 text-purple-700" 
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {config?.label || doc.type}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleCopyRichText} className="h-9 font-bold text-xs uppercase tracking-widest bg-white">
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy to Docs'}
                </Button>
                <Button onClick={handlePrint} className="h-9 font-bold text-xs uppercase tracking-widest bg-gray-900 hover:bg-gray-800 text-white shadow-md">
                  <Download className="w-4 h-4 mr-2" />
                  Save PDF
                </Button>
              </div>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
              <AnimatePresence mode="wait">
                {activeDoc && (
                  <motion.div
                    key={activeDoc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-center print:block"
                  >
                    {/* A4 Page Container */}
                    <div 
                      ref={contentRef}
                      id="printable-document"
                      className="w-full max-w-[850px] bg-white shadow-xl rounded-sm print:shadow-none print:rounded-none print:max-w-none print:w-full"
                    >
                      <DocumentRenderer type={activeDoc.type} content={activeDoc.content} theme={theme} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function BadgeSuggestion({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="text-xs font-medium bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-purple-300 hover:text-purple-700 transition-colors shadow-sm"
    >
      {text}
    </button>
  );
}
