import React from 'react';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-8 text-white shadow-xl">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
          <Sparkles size={14} />
          AI-Powered Planning
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          What event are you planning today?
        </h1>
        <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed">
          Transform your raw ideas into professional event proposals, flyers, checklists, and more in seconds. 
          Enter your event details once, and let AI handle the documentation.
        </p>
      </div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
    </div>
  );
}
