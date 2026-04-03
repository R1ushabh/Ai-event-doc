import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowLeft, 
  Filter, 
  Zap, 
  ChevronRight,
  Star,
  Plus
} from 'lucide-react';

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All', 'Flyers', 'Proposals', 'Reports', 'Budgets', 'Timelines', 'Academic', 'Corporate', 'Creative'
  ];

  const templates = [
    { id: 'minimal-academic', title: 'Minimal Academic Flyer', desc: 'Clean and formal layout for seminars and workshops.', type: 'Flyer', category: 'Academic', color: 'bg-blue-500' },
    { id: 'bold-tech', title: 'Bold Tech Flyer', desc: 'High-impact design for hackathons and tech events.', type: 'Flyer', category: 'Creative', color: 'bg-purple-500' },
    { id: 'dept-approval', title: 'Department Approval Proposal', desc: 'Structured proposal for institutional event permission.', type: 'Proposal', category: 'Academic', color: 'bg-emerald-500' },
    { id: 'sponsorship', title: 'Sponsorship Proposal', desc: 'Persuasive layout to attract event sponsors.', type: 'Proposal', category: 'Corporate', color: 'bg-amber-500' },
    { id: 'hackathon-pack', title: 'Hackathon Full Pack', desc: 'Complete set: Flyer, Proposal, Budget, and Timeline.', type: 'Bundle', category: 'Creative', color: 'bg-indigo-500' },
    { id: 'post-event', title: 'Post-Event Summary Report', desc: 'Professional report to summarize event outcomes.', type: 'Report', category: 'Corporate', color: 'bg-rose-500' },
    { id: 'academic-budget', title: 'Academic Budget Sheet', desc: 'Detailed cost breakdown for college events.', type: 'Budget', category: 'Academic', color: 'bg-cyan-500' },
    { id: 'one-day-timeline', title: 'One-Day Event Timeline', desc: 'Minute-by-minute schedule for short events.', type: 'Timeline', category: 'Creative', color: 'bg-orange-500' },
  ];

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory || t.type === activeCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-20 bg-surface border-b border-border px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 rounded-full hover:bg-panel transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary group-hover:text-primary-accent transition-colors" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">Template Gallery</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="bg-panel border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all w-64"
            />
          </div>
          <button className="bg-primary-accent text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-accent-hover transition-all shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Custom
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">Start with a professional template</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Choose from our curated collection of event document templates designed for students, departments, and institutions.
          </p>
        </section>

        {/* Filter Bar */}
        <section className="flex flex-wrap items-center gap-3 pb-4 border-b border-border sticky top-20 bg-background/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2 mr-4 text-text-secondary">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Filter by:</span>
          </div>
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === category 
                  ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/20' 
                  : 'bg-surface border border-border text-text-secondary hover:bg-panel hover:text-text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        {/* Template Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
          {filteredTemplates.map((template, i) => (
            <motion.div 
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface rounded-[32px] border border-border overflow-hidden group hover:shadow-xl hover:border-primary-accent/30 transition-all flex flex-col"
            >
              <div className={`h-48 ${template.color} relative p-6 flex flex-col justify-end group-hover:h-52 transition-all duration-500`}>
                <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 space-y-2 group-hover:scale-105 transition-transform">
                  <div className="h-2 bg-white/40 rounded-full w-3/4" />
                  <div className="h-2 bg-white/20 rounded-full w-full" />
                  <div className="h-2 bg-white/20 rounded-full w-5/6" />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary-accent uppercase tracking-wider bg-primary-accent/5 px-2 py-0.5 rounded-full">
                      {template.type}
                    </span>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight leading-tight group-hover:text-primary-accent transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                    {template.desc}
                  </p>
                </div>
                
                <div className="pt-4 mt-auto border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>AI-Ready</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/workspace/new?template=${template.id}`)}
                    className="flex items-center gap-1 text-sm font-bold text-primary-accent hover:gap-2 transition-all"
                  >
                    Use Template
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-panel/30 text-center">
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-full shadow-sm inline-flex mx-auto">
          <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Developed at</span>
          <span className="text-[10px] font-bold text-primary-accent uppercase tracking-wider">PCE</span>
        </div>
      </footer>
    </div>
  );
};

export default Templates;
