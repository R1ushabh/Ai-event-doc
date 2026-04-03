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

  const themeLower = theme.toLowerCase();
  
  // Style detection
  const isMinimal = themeLower.includes('minimal');
  const isAcademic = themeLower.includes('academic');
  const isTech = themeLower.includes('tech') || themeLower.includes('cyberpunk');
  const isFormal = themeLower.includes('formal') || themeLower.includes('institutional');
  const isCreative = themeLower.includes('creative') || themeLower.includes('vibrant') || themeLower.includes('festival');
  const isCorporate = themeLower.includes('corporate') || themeLower.includes('elegant');
  
  const isPokemon = themeLower.includes('pokemon');
  const isGrass = isPokemon && (themeLower.includes('grass') || themeLower.includes('nature'));
  const isFire = isPokemon && (themeLower.includes('fire') || themeLower.includes('blaze'));

  const isFlyer = type === 'flyer';

  return (
    <div className={cn(
      "w-full bg-white text-gray-900 font-sans relative overflow-hidden transition-all duration-500",
      isFlyer && "min-h-[1000px] flex flex-col",
      
      // Theme specific containers
      isMinimal && "border-t-8 border-blue-500",
      isAcademic && "border-t-8 border-emerald-500 font-serif",
      isTech && "bg-slate-950 text-cyan-400 border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]",
      isFormal && "border-t-[24px] border-slate-900 font-serif",
      isCreative && "bg-rose-50 border-x-[12px] border-rose-500",
      isCorporate && "border-t-[20px] border-indigo-900 font-serif",
      
      isPokemon && "border-8 border-red-600",
      isGrass && "border-green-600 bg-green-50",
      isFire && "border-orange-600 bg-orange-50",
      
      className
    )}>
      {/* Decorative Elements */}
      {isTech && isFlyer && (
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,24,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      )}

      {isPokemon && isFlyer && (
        <>
          <div className={cn("absolute top-0 left-0 w-full h-12 z-0", isGrass ? "bg-green-600" : isFire ? "bg-orange-600" : "bg-red-600")} />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-8 border-gray-900 rounded-full z-10 flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-900 rounded-full" />
          </div>
          <div className="absolute top-12 left-0 w-full h-2 bg-gray-900 z-0" />
          <Pokeball isGrass={isGrass} isFire={isFire} className="absolute -top-4 -left-4 w-20 h-20 opacity-20 rotate-12" />
          <Pokeball isGrass={isGrass} isFire={isFire} className="absolute -bottom-4 -right-4 w-24 h-24 opacity-20 -rotate-12" />
        </>
      )}

      <div className={cn(
        "relative z-10 p-12 md:p-16",
        "prose max-w-none",
        
        // Theme specific typography
        isMinimal && "prose-blue prose-headings:text-blue-600",
        isAcademic && "prose-emerald prose-headings:font-serif",
        isTech && "prose-invert prose-purple prose-headings:text-cyan-400 prose-headings:italic",
        isFormal && "prose-slate prose-headings:font-serif prose-headings:text-slate-900",
        isCreative && "prose-rose prose-headings:text-rose-600",
        isCorporate && "prose-indigo prose-headings:font-serif prose-headings:text-indigo-900",
        
        isPokemon && "prose-red prose-h1:text-red-600 prose-h1:uppercase prose-h1:font-black prose-h1:tracking-widest",
        
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-5xl prose-h1:mb-12 prose-h1:border-b prose-h1:pb-6 prose-h1:text-center",
        "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:pl-6 prose-h2:border-current",
        "prose-h3:text-2xl prose-h3:mt-8",
        "prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700",
        isTech && "prose-p:text-cyan-100/80",
        
        "prose-blockquote:border-l-4 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:not-italic prose-blockquote:rounded-r-2xl",
        isTech && "prose-blockquote:bg-slate-900 prose-blockquote:text-cyan-200 prose-blockquote:border-purple-500",
        
        "prose-table:w-full prose-table:border-collapse prose-table:my-8",
        "prose-th:bg-gray-50 prose-th:p-4 prose-th:text-left prose-th:border prose-th:border-gray-200 prose-th:font-bold",
        isTech && "prose-th:bg-slate-900 prose-th:border-purple-900 prose-th:text-cyan-400",
        "prose-td:p-4 prose-td:border prose-td:border-gray-100",
        isTech && "prose-td:border-purple-900/30 prose-td:text-cyan-100/70",
        
        "prose-img:rounded-3xl prose-img:shadow-lg"
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
