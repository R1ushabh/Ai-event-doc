import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Palette,
  ArrowLeft,
  ChevronRight,
  Layout,
  Check,
  MoreHorizontal,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const EVENT_TYPES = [
  'Workshop', 'Seminar', 'Hackathon', 'Webinar', 'Conference', 'Cultural Event', 'Training Program'
];

const STYLE_TEMPLATES = [
  { id: 'minimal', label: 'Minimal Clean', color: 'bg-blue-500' },
  { id: 'academic', label: 'Modern Academic', color: 'bg-emerald-500' },
  { id: 'tech', label: 'Tech Neon', color: 'bg-purple-500' },
  { id: 'formal', label: 'Formal Institutional', color: 'bg-slate-700' },
  { id: 'creative', label: 'Creative Poster', color: 'bg-rose-500' },
  { id: 'corporate', label: 'Elegant Corporate', color: 'bg-indigo-600' },
];

export default function Workspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [prompt, setPrompt] = useState('');
  const [theme, setTheme] = useState('');
  const [eventType, setEventType] = useState('Workshop');
  const [selectedStyle, setSelectedStyle] = useState('minimal');
  const [requestedDocs, setRequestedDocs] = useState<DocType[]>(['proposal', 'flyer']);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [generatedDocs, setGeneratedDocs] = useState<DocumentOutput[]>([]);
  const [activeTab, setActiveTab] = useState<DocType | null>(null);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      // Handle template pre-selection
      if (templateId.includes('hackathon')) setEventType('Hackathon');
      if (templateId.includes('seminar')) setEventType('Seminar');
      if (templateId.includes('workshop')) setEventType('Workshop');
    }
  }, [searchParams]);

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
    setProgress('Understanding Event...');

    const input: EventInput = {
      prompt: `${eventType}: ${prompt}`,
      theme: `${selectedStyle} style, ${theme || 'Professional'}`,
      requestedDocs
    };

    const orchestrator = new Orchestrator((event: OrchestratorEvent) => {
      if (event.type === 'agent_start') {
        setProgress(`Drafting ${event.agent}...`);
      } else if (event.type === 'document_done') {
        setProgress(`Finalizing ${event.docType}...`);
      } else if (event.type === 'generation_complete') {
        setProgress('Polishing documents...');
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
    if (!activeDoc) return;
    try {
      const payload = {
        type: activeDoc.type,
        title: `${activeDoc.type.charAt(0).toUpperCase() + activeDoc.type.slice(1)} - ${theme || 'Event'}`,
        content: activeDoc.content,
        template_id: selectedStyle
      };
      const storeResponse = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!storeResponse.ok) throw new Error('Failed to store document');
      const storedDoc = await storeResponse.json();
      window.location.href = `/api/export/pdf/${storedDoc.metadata.id}`;
    } catch (error) {
      console.error("PDF Export failed:", error);
      window.print();
    }
  };

  const handleCopyRichText = () => {
    const docElement = contentRef.current;
    if (!docElement) return;
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = 'true';
    tempDiv.innerHTML = docElement.innerHTML;
    document.body.appendChild(tempDiv);
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
    <div className="flex h-screen bg-background overflow-hidden font-sans text-text-primary">
      
      {/* LEFT PANEL - PROMPT & CONTROLS */}
      <aside className="w-[450px] bg-surface border-r border-border flex flex-col shrink-0 print:hidden z-20 shadow-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-panel transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Generator</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Section 1: Describe Event */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-text-primary">Describe Your Event</Label>
              <span className="text-[10px] font-bold text-primary-accent uppercase tracking-widest bg-primary-accent/5 px-2 py-0.5 rounded-full">AI Powered</span>
            </div>
            <Textarea 
              placeholder="e.g., PCE is hosting a 2-day AI hackathon with a ₹1 lakh prize pool for engineering students."
              className="min-h-[140px] resize-none text-base p-5 border-border bg-panel focus:bg-surface focus:ring-4 focus:ring-primary-accent/10 focus:border-primary-accent transition-all rounded-2xl shadow-inner"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Section 2: Event Type */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-text-primary">Event Type</Label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setEventType(type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                    eventType === type 
                      ? "bg-primary-accent text-white border-primary-accent shadow-md" 
                      : "bg-surface text-text-secondary border-border hover:border-text-secondary"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Theme */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary-accent" />
              Theme / Vibe
            </Label>
            <Input 
              placeholder="e.g., Cyberpunk, Elegant Corporate, Minimal Modern"
              className="h-12 text-base px-5 border-border bg-panel focus:bg-surface focus:ring-4 focus:ring-primary-accent/10 focus:border-primary-accent transition-all rounded-2xl"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>

          {/* Section 4: Document Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-text-primary">Documents to Generate</Label>
            <div className="grid grid-cols-2 gap-3">
              {DOC_TYPES.map((doc) => {
                const Icon = doc.icon;
                const isSelected = requestedDocs.includes(doc.id);
                return (
                  <div 
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all",
                      isSelected 
                        ? "border-primary-accent bg-primary-accent/5 text-primary-accent shadow-sm" 
                        : "border-border bg-panel/30 hover:border-text-secondary text-text-secondary"
                    )}
                  >
                    <div className={cn("w-5 h-5 rounded-md border flex items-center justify-center transition-all", isSelected ? "bg-primary-accent border-primary-accent" : "bg-surface border-border")}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <Icon className={cn("w-4 h-4", isSelected ? "text-primary-accent" : "text-text-secondary")} />
                    <span className="text-xs font-bold">{doc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Template Style */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-text-primary">Template Style</Label>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_TEMPLATES.map(style => (
                <div 
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "p-3 rounded-2xl border cursor-pointer transition-all space-y-3",
                    selectedStyle === style.id 
                      ? "border-primary-accent bg-primary-accent/5 ring-2 ring-primary-accent/10" 
                      : "border-border bg-panel/30 hover:border-text-secondary"
                  )}
                >
                  <div className={`h-16 ${style.color} rounded-xl opacity-80 flex items-center justify-center`}>
                    <Layout className="w-6 h-6 text-white/50" />
                  </div>
                  <p className={cn("text-[10px] font-bold text-center uppercase tracking-wider", selectedStyle === style.id ? "text-primary-accent" : "text-text-secondary")}>
                    {style.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-border bg-panel/30">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || requestedDocs.length === 0}
            className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary-accent/20 bg-primary-accent hover:bg-accent-hover text-white transition-all disabled:opacity-50 disabled:shadow-none group"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Generate Documents
              </>
            )}
          </Button>
          {isGenerating && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-primary-accent uppercase tracking-widest">
                <span>{progress}</span>
                <span>75%</span>
              </div>
              <div className="h-1.5 bg-primary-accent/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-primary-accent"
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT PANEL - PREVIEW & WORKSPACE */}
      <main className="flex-1 flex flex-col relative bg-panel/50 print:bg-white print:absolute print:inset-0 print:w-full print:h-full overflow-hidden">
        
        {generatedDocs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center print:hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 max-w-md"
            >
              <div className="w-24 h-24 bg-primary-accent/10 rounded-[40px] flex items-center justify-center mx-auto shadow-inner relative">
                <FileText className="w-10 h-10 text-primary-accent" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface border border-border rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-primary-accent" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-text-primary tracking-tight">Your AI Workspace</h2>
                <p className="text-text-secondary leading-relaxed">Describe your event on the left, pick a style, and let the AI generate professional, ready-to-export documents instantly.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <BadgeSuggestion text="Try: A college hackathon with a retro 80s theme" onClick={() => {
                  setPrompt("Our college is hosting a 2-day hackathon for 500 students. We have a budget of $5000 and need sponsors.");
                  setTheme("Retro 80s Arcade");
                  setEventType("Hackathon");
                }} />
                <BadgeSuggestion text="Try: A Pokemon themed birthday party" onClick={() => {
                  setPrompt("A birthday party for a 10-year old who loves Pokemon. We need a flyer and a timeline.");
                  setTheme("Pokemon Adventure");
                  setEventType("Cultural Event");
                  setRequestedDocs(['flyer', 'timeline']);
                }} />
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Workspace Header */}
            <header className="h-20 bg-surface border-b border-border px-8 flex items-center justify-between shrink-0 print:hidden z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-text-primary truncate max-w-xs">{eventType}: {prompt.slice(0, 30)}...</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary-accent uppercase tracking-widest bg-primary-accent/5 px-2 py-0.5 rounded-full border border-primary-accent/10">
                      {selectedStyle} Style
                    </span>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-panel px-2 py-0.5 rounded-full border border-border">
                      {eventType}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleCopyRichText} className="h-11 px-5 rounded-xl font-bold text-xs uppercase tracking-widest bg-surface border-border hover:bg-panel transition-all">
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-success" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy to Docs'}
                </Button>
                <Button onClick={handlePrint} className="h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-text-primary hover:bg-black text-white shadow-lg transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Save PDF
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <button className="p-2 rounded-xl hover:bg-panel transition-colors">
                  <Share2 className="w-5 h-5 text-text-secondary" />
                </button>
                <button className="p-2 rounded-xl hover:bg-panel transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            </header>

            {/* Document Tabs */}
            <div className="bg-surface border-b border-border px-8 flex items-center gap-1 shrink-0 print:hidden">
              {generatedDocs.map(doc => {
                const config = DOC_TYPES.find(d => d.id === doc.type);
                const Icon = config?.icon || FileText;
                const isActive = activeTab === doc.type;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setActiveTab(doc.type)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative",
                      isActive 
                        ? "text-primary-accent" 
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {config?.label || doc.type}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-accent"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 overflow-y-auto p-12 print:p-0 print:overflow-visible custom-scrollbar bg-panel/30">
              <AnimatePresence mode="wait">
                {activeDoc && (
                  <motion.div
                    key={activeDoc.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center print:block"
                  >
                    {/* A4 Page Container */}
                    <div 
                      ref={contentRef}
                      id="printable-document"
                      className="w-full max-w-[850px] bg-surface shadow-[0_0_50px_rgba(0,0,0,0.05)] rounded-2xl border border-border overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full print:border-none"
                    >
                      <div className="p-12 md:p-16">
                        <DocumentRenderer type={activeDoc.type} content={activeDoc.content} theme={theme} />
                      </div>
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
      className="text-sm font-medium bg-surface border border-border text-text-secondary px-5 py-3 rounded-2xl hover:border-primary-accent hover:text-primary-accent hover:bg-primary-accent/5 transition-all shadow-sm text-left flex items-center justify-between group"
    >
      {text}
      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
    </button>
  );
}
