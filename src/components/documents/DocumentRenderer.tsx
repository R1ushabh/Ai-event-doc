import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { DocType } from '@/ai/types';

interface DocumentRendererProps {
  type: DocType;
  content: string;
  theme?: string;
  className?: string;
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({ type, content, theme = '', className }) => {
  if (!content) return null;

  const isPokemon = theme.toLowerCase().includes('pokemon');
  const isGrass = isPokemon && (theme.toLowerCase().includes('grass') || theme.toLowerCase().includes('nature'));
  const isFire = isPokemon && (theme.toLowerCase().includes('fire') || theme.toLowerCase().includes('blaze'));
  
  const isCyberpunk = theme.toLowerCase().includes('cyberpunk');
  const isRetro = theme.toLowerCase().includes('retro') || theme.toLowerCase().includes('80s');
  const isCorporate = theme.toLowerCase().includes('corporate') || theme.toLowerCase().includes('elegant');
  const isFestival = theme.toLowerCase().includes('festival') || theme.toLowerCase().includes('vibrant');
  
  const isFlyer = type === 'flyer';

  return (
    <div className={cn(
      "w-full bg-white p-12 md:p-16 text-gray-900 font-sans relative overflow-hidden",
      isFlyer && "min-h-[1000px] flex flex-col",
      isPokemon && "border-8 border-red-600",
      isGrass && "border-green-600 bg-green-50",
      isFire && "border-orange-600 bg-orange-50",
      isCyberpunk && "bg-gray-900 text-cyan-400 border-4 border-magenta-500",
      isRetro && "bg-pink-50 border-4 border-yellow-400",
      isCorporate && "border-t-[20px] border-slate-900 font-serif",
      isFestival && "bg-orange-50 border-x-[12px] border-orange-500",
      className
    )}>
      {/* Decorative Elements for Themes */}
      {isPokemon && isFlyer && (
        <>
          <div className={cn("absolute top-0 left-0 w-full h-12 z-0", isGrass ? "bg-green-600" : isFire ? "bg-orange-600" : "bg-red-600")} />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-8 border-gray-900 rounded-full z-10 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-full" />
          </div>
          <div className="absolute top-12 left-0 w-full h-2 bg-gray-900 z-0" />
          
          {/* Corner Pokeballs */}
          <Pokeball isGrass={isGrass} isFire={isFire} className="absolute -top-4 -left-4 w-20 h-20 opacity-20 rotate-12" />
          <Pokeball isGrass={isGrass} isFire={isFire} className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 -rotate-12" />
          <Pokeball isGrass={isGrass} isFire={isFire} className="absolute top-1/2 -left-10 w-32 h-32 opacity-10" />
          <Pokeball isGrass={isGrass} isFire={isFire} className="absolute top-1/4 -right-10 w-16 h-16 opacity-10" />
        </>
      )}

      {isCorporate && isFlyer && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 -rotate-45 translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 border-l border-b border-slate-200" />
        </>
      )}

      {isFestival && isFlyer && (
        <>
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl" />
        </>
      )}

      {isCyberpunk && isFlyer && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_cyan]" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-magenta-500 shadow-[0_0_10px_magenta]" />
          <div className="absolute top-10 right-10 w-20 h-20 border border-cyan-400/30 rotate-45" />
          <div className="absolute bottom-20 left-10 w-32 h-32 border border-magenta-500/20 -rotate-12" />
        </>
      )}

      <div className={cn(
        "relative z-10",
        "prose prose-purple max-w-none",
        isCyberpunk && "prose-invert prose-cyan",
        isRetro && "prose-pink",
        isCorporate && "prose-slate font-serif",
        isFestival && "prose-orange",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-5xl prose-h1:mb-8 prose-h1:border-b prose-h1:pb-4 prose-h1:text-center",
        isPokemon && "prose-h1:text-red-600 prose-h1:border-gray-900 prose-h1:uppercase prose-h1:font-black prose-h1:tracking-widest",
        isPokemon && "prose-h2:text-red-500 prose-h2:border-l-8 prose-h2:border-red-500 prose-h2:pl-4",
        isPokemon && "prose-li:marker:text-red-600 prose-li:font-bold",
        isPokemon && "prose-blockquote:bg-red-50 prose-blockquote:border-red-600 prose-blockquote:rounded-xl",
        isCyberpunk && "prose-h1:text-cyan-400 prose-h1:border-magenta-500 prose-h1:italic",
        isCorporate && "prose-h1:text-slate-900 prose-h1:border-slate-200 prose-h1:text-left prose-h1:font-serif",
        isFestival && "prose-h1:text-orange-600 prose-h1:border-orange-200",
        "prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4",
        "prose-h3:text-2xl prose-h3:mt-8",
        "prose-p:text-lg prose-p:leading-relaxed",
        isCyberpunk && "prose-p:text-cyan-100",
        isCorporate && "prose-p:text-slate-700",
        "prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-700",
        isCyberpunk && "prose-blockquote:bg-gray-800 prose-blockquote:text-cyan-200 prose-blockquote:border-cyan-400",
        isCorporate && "prose-blockquote:bg-slate-50 prose-blockquote:border-slate-900 prose-blockquote:text-slate-800",
        isCorporate && "prose-li:marker:text-slate-900",
        isFestival && "prose-li:marker:text-orange-500",
        isPokemon && "prose-li:marker:text-red-600",
        "prose-table:w-full prose-table:border-collapse",
        "prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-200",
        isCyberpunk && "prose-th:bg-gray-800 prose-th:border-cyan-900 prose-th:text-cyan-400",
        isCorporate && "prose-th:bg-slate-100 prose-th:border-slate-300",
        "prose-td:p-3 prose-td:border prose-td:border-gray-200",
        isCyberpunk && "prose-td:border-cyan-900 prose-td:text-cyan-100",
        isCorporate && "prose-td:border-slate-200",
      )}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

function Pokeball({ className, isGrass, isFire }: { className?: string; isGrass?: boolean; isFire?: boolean }) {
  return (
    <div className={cn("relative rounded-full border-4 border-gray-900 overflow-hidden bg-white", className)}>
      <div className={cn("absolute top-0 left-0 w-full h-1/2", isGrass ? "bg-green-600" : isFire ? "bg-orange-600" : "bg-red-600")} />
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-900 -translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-1/3 h-1/3 bg-white border-4 border-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
