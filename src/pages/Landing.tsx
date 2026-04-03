import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layout, 
  FileText, 
  DollarSign, 
  Clock, 
  Download, 
  ArrowRight
} from 'lucide-react';

const Landing: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary-accent/10">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary">EventForge AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#product" className="text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors">Product</a>
              <a href="#templates" className="text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors">Templates</a>
              <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors">Features</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors">Sign In</Link>
              <Link to="/auth" className="bg-primary-accent text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent-hover transition-all shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-accent/5 border border-primary-accent/10 text-primary-accent text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              AI-Powered Event Creation
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight">
              Create Event Documents with AI, <span className="text-primary-accent">Not Manual Work</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-text-secondary leading-relaxed max-w-lg">
              Turn a simple event idea into polished proposals, flyers, budgets, timelines, and reports — all in one workspace.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/auth" className="bg-primary-accent text-white px-8 py-4 rounded-2xl font-semibold hover:bg-accent-hover transition-all shadow-lg flex items-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/templates" className="bg-surface text-text-primary border border-border px-8 py-4 rounded-2xl font-semibold hover:bg-panel transition-all shadow-sm">
                Explore Templates
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-panel flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-secondary">
                Trusted by <span className="font-semibold text-text-primary">500+</span> event organizers
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-accent/10 to-secondary-accent/10 blur-3xl rounded-[40px]" />
            <div className="relative bg-surface border border-border rounded-[32px] shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="absolute top-0 w-full h-12 bg-panel border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-surface border border-border px-3 py-1 rounded-md text-[10px] text-text-secondary w-48 text-center">
                    eventforge.ai/workspace/hackathon-2026
                  </div>
                </div>
              </div>
              <div className="pt-16 p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="w-1/3 space-y-3">
                    <div className="h-4 bg-panel rounded-md w-3/4" />
                    <div className="h-3 bg-panel/50 rounded-md w-full" />
                    <div className="h-3 bg-panel/50 rounded-md w-5/6" />
                    <div className="pt-4 space-y-2">
                      <div className="h-8 bg-primary-accent/10 rounded-lg w-full" />
                      <div className="h-8 bg-panel rounded-lg w-full" />
                    </div>
                  </div>
                  <div className="flex-1 bg-panel/30 rounded-2xl border border-border p-6 space-y-4">
                    <div className="h-6 bg-surface rounded-lg w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-surface rounded-md w-full" />
                      <div className="h-3 bg-surface rounded-md w-full" />
                      <div className="h-3 bg-surface rounded-md w-3/4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="h-24 bg-surface rounded-xl border border-border" />
                      <div className="h-24 bg-surface rounded-xl border border-border" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-panel/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Everything you need for event planning</h2>
          <p className="text-text-secondary">Powerful AI tools to help you create professional documents in seconds.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Sparkles, title: "Generate from Prompt", desc: "Describe your event in natural language and let AI do the rest." },
            { icon: Layout, title: "Smart Templates", desc: "Start with pre-designed layouts for workshops, hackathons, and more." },
            { icon: FileText, title: "Structured Proposals", desc: "Generate professional event proposals ready for institutional approval." },
            { icon: DollarSign, title: "Budget Sheets", desc: "AI-calculated budget estimates and cost breakdowns for your events." },
            { icon: Clock, title: "Timeline Planning", desc: "Automatically structured schedules and minute-by-minute timelines." },
            { icon: Download, title: "Export Ready", desc: "Download your documents as PDF, DOCX, or copy directly to Google Docs." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-surface p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-primary-accent/5 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="text-primary-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-text-primary mb-4">How it works</h2>
          <p className="text-text-secondary">Three simple steps to professional event documents.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-border" />
          {[
            { step: "01", title: "Describe your event", desc: "Type a short summary of your event idea and goals." },
            { step: "02", title: "Choose a style", desc: "Select a template and visual theme that fits your event." },
            { step: "03", title: "Generate & Export", desc: "Review the AI-generated documents and export them instantly." }
          ].map((item, i) => (
            <div key={i} className="relative text-center space-y-4">
              <div className="w-12 h-12 bg-surface border border-border rounded-full flex items-center justify-center mx-auto text-primary-accent font-bold relative z-10">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-text-primary">{item.title}</h3>
              <p className="text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-primary-accent rounded-[40px] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to plan your next event in minutes?</h2>
          <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto relative z-10">
            Join hundreds of organizers who are saving hours of manual document work with EventForge AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/auth" className="bg-white text-primary-accent px-8 py-4 rounded-2xl font-bold hover:bg-panel transition-all shadow-xl">
              Start Creating Now
            </Link>
            <Link to="/templates" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
              View Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-panel/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-text-primary">EventForge AI</span>
              </div>
              <p className="text-text-secondary max-w-xs leading-relaxed">
                Empowering organizers with AI-driven document generation for better event planning.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-text-primary mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-primary-accent transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-accent transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-primary-accent transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-primary-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-accent transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-text-secondary">
              © 2026 EventForge AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full shadow-sm">
              <span className="text-xs font-medium text-text-secondary">Developed as part of learning at</span>
              <span className="text-xs font-bold text-primary-accent">PCE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
