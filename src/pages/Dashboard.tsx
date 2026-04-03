import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Layout, 
  FileText, 
  DollarSign, 
  Plus, 
  Search, 
  Bell, 
  MoreVertical, 
  Settings, 
  Home, 
  FolderOpen, 
  Download, 
  LogOut,
  Star,
  Calendar,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const recentProjects = [
    { id: 1, title: 'AI Workshop 2026', type: 'Workshop', date: '2 hours ago', docs: 4, color: 'bg-blue-500' },
    { id: 2, title: 'ByteStream Hackathon', type: 'Hackathon', date: 'Yesterday', docs: 6, color: 'bg-purple-500' },
    { id: 3, title: 'Seminar on Innovation', type: 'Seminar', date: '3 days ago', docs: 3, color: 'bg-emerald-500' },
    { id: 4, title: 'Cultural Fest Plan', type: 'Cultural Event', date: '1 week ago', docs: 8, color: 'bg-amber-500' },
  ];

  const quickActions = [
    { icon: Sparkles, title: 'Create from Prompt', desc: 'Generate documents with AI', path: '/workspace/new', color: 'bg-primary-accent' },
    { icon: Layout, title: 'Use a Template', desc: 'Start with a layout', path: '/templates', color: 'bg-secondary-accent' },
    { icon: FileText, title: 'Generate Flyer', desc: 'Create a beautiful poster', path: '/workspace/new?type=flyer', color: 'bg-blue-500' },
    { icon: DollarSign, title: 'Create Proposal', desc: 'Formal event proposal', path: '/workspace/new?type=proposal', color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">EventForge AI</span>
          </Link>
          
          <nav className="space-y-1">
            <SidebarItem icon={Home} label="Home" active />
            <SidebarItem icon={Plus} label="Create New" onClick={() => navigate('/workspace/new')} />
            <SidebarItem icon={Layout} label="Templates" onClick={() => navigate('/templates')} />
            <SidebarItem icon={FolderOpen} label="My Projects" />
            <SidebarItem icon={Download} label="Exports" />
            <SidebarItem icon={Settings} label="Settings" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-panel transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary-accent/10 flex items-center justify-center overflow-hidden">
              <img src="https://i.pravatar.cc/100?img=12" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">Rushabh</p>
              <p className="text-xs text-text-secondary truncate">Workspace</p>
            </div>
            <LogOut className="w-4 h-4 text-text-secondary group-hover:text-red-500 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search projects, templates..." 
              className="w-full bg-panel border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:border-primary-accent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-panel transition-colors relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface" />
            </button>
            <button 
              onClick={() => navigate('/workspace/new')}
              className="bg-primary-accent text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-accent-hover transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New
            </button>
          </div>
        </header>

        <div className="p-8 space-y-12 max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <section>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <h2 className="text-3xl font-bold text-text-primary tracking-tight">Good evening, Rushabh</h2>
              <p className="text-text-secondary">What event would you like to create today?</p>
            </motion.div>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(action.path)}
                className="group cursor-pointer bg-surface p-6 rounded-[32px] border border-border shadow-sm hover:shadow-md hover:border-primary-accent/30 transition-all"
              >
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-accent/10 group-hover:scale-110 transition-transform`}>
                  <action.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1">{action.title}</h3>
                <p className="text-sm text-text-secondary">{action.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* Recent Projects */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary-accent" />
                Recent Projects
              </h3>
              <button className="text-sm font-bold text-primary-accent hover:underline">View all</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface rounded-[32px] border border-border overflow-hidden group hover:shadow-lg transition-all"
                >
                  <div className={`h-32 ${project.color} relative p-6 flex flex-col justify-end`}>
                    <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider w-fit">
                      <Zap className="w-3 h-3" />
                      {project.type}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-text-primary mb-1 truncate">{project.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Calendar className="w-3 h-3" />
                        <span>Edited {project.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs font-medium text-text-secondary">{project.docs} documents</span>
                      <button className="p-1 rounded-lg hover:bg-panel transition-colors">
                        <MoreVertical className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Saved Templates */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Layout className="w-5 h-5 text-secondary-accent" />
                Popular Templates
              </h3>
              <button onClick={() => navigate('/templates')} className="text-sm font-bold text-primary-accent hover:underline">Explore all</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['Hackathon', 'Workshop', 'Seminar', 'Webinar'].map((template, i) => (
                <div key={i} className="bg-panel rounded-3xl p-6 border border-border/50 hover:border-primary-accent/30 transition-all cursor-pointer group">
                  <div className="aspect-[4/3] bg-surface rounded-2xl border border-border mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                    <Layout className="w-8 h-8 text-border group-hover:text-primary-accent/20 transition-colors" />
                  </div>
                  <h4 className="font-bold text-text-primary text-center">{template} Pack</h4>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
      active 
        ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/20' 
        : 'text-text-secondary hover:bg-panel hover:text-text-primary'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export default Dashboard;
