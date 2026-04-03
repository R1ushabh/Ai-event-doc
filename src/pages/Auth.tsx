import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Globe } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Mock sign in for now
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-accent/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-accent transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="bg-surface border border-border rounded-[32px] p-10 shadow-xl space-y-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-accent/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Welcome to EventForge AI</h1>
            <p className="text-text-secondary text-sm">
              Continue to your AI workspace to start creating.
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-surface border border-border px-6 py-4 rounded-2xl font-semibold text-text-primary hover:bg-panel transition-all shadow-sm group"
            >
              <Globe className="w-5 h-5 text-primary-accent group-hover:scale-110 transition-transform" />
              Continue with Google
            </button>
            
            <button 
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-panel border border-border/50 px-6 py-4 rounded-2xl font-semibold text-text-secondary hover:bg-border/30 transition-all"
            >
              Continue as Guest
            </button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-text-secondary leading-relaxed">
              By continuing, you agree to our <a href="#" className="underline hover:text-primary-accent transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-primary-accent transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-text-secondary">
            Your recent projects and templates will be saved to your workspace.
          </p>
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-surface/50 border border-border/50 rounded-full inline-flex mx-auto">
            <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">Developed at</span>
            <span className="text-[10px] font-bold text-primary-accent uppercase tracking-wider">PCE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
