import React, { useState } from 'react';
import { GlossToken } from '../types';
import { GlossaryPanel } from './GlossaryPanel';
import { StudyList } from './StudyList';

interface GlossViewProps {
  tokens: GlossToken[];
}

export const GlossView: React.FC<GlossViewProps> = ({ tokens }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flaggedIndices, setFlaggedIndices] = useState<Set<number>>(new Set());

  const toggleFlag = (index: number) => {
    const newSet = new Set(flaggedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setFlaggedIndices(newSet);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-700">
      
      {/* Left: Study List (Hidden on very small screens, viewable on large) */}
      <div className="hidden lg:block">
        <StudyList 
          tokens={tokens} 
          flaggedIndices={flaggedIndices} 
          onSelectToken={setActiveIndex}
          activeIndex={activeIndex}
        />
      </div>

      {/* Center: Text Area */}
      <div className="flex-1 overflow-y-auto bg-parchment-100 p-6 lg:p-12 shadow-inner lg:shadow-none">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-xl prose-p:font-serif prose-p:text-2xl prose-p:leading-loose text-parchment-900 text-justify">
            <p className="flex flex-wrap gap-x-1.5 gap-y-2 items-baseline">
              {tokens.map((token, index) => {
                const isActive = activeIndex === index;
                const isFlagged = flaggedIndices.has(index);
                const isPunc = token.isPunctuation;
                
                return (
                  <span
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`
                      relative cursor-pointer transition-all duration-200 rounded px-1 -mx-1
                      ${isPunc ? 'text-parchment-800' : ''}
                      ${isActive 
                        ? 'bg-parchment-300 shadow-sm z-10 scale-105 font-medium' 
                        : 'hover:bg-parchment-200'}
                      ${isFlagged && !isActive
                        ? 'text-red-900 bg-red-100/50 decoration-red-200/50'
                        : 'text-parchment-900'}
                      ${isFlagged && isActive
                         ? 'text-red-950 ring-1 ring-red-900/20'
                         : ''}
                    `}
                  >
                    {token.original}
                  </span>
                );
              })}
            </p>
          </div>
          
          <div className="mt-16 pt-8 border-t border-parchment-300 text-center">
             <span className="text-parchment-500 text-sm font-serif italic">
               (Click words to view their gloss)
             </span>
          </div>
        </div>
      </div>

      {/* Right: Glossary Panel */}
      <div className="h-64 lg:h-auto lg:w-[400px] xl:w-[480px] flex-shrink-0 z-20 shadow-2xl lg:shadow-none">
        <GlossaryPanel 
          token={activeIndex !== null ? tokens[activeIndex] : null}
          isFlagged={activeIndex !== null ? flaggedIndices.has(activeIndex) : false}
          onToggleFlag={() => activeIndex !== null && toggleFlag(activeIndex)}
        />
      </div>
      
    </div>
  );
};