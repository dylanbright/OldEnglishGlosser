import React, { useState } from 'react';
import { GlossToken } from '../types';
import { GlossaryPanel } from './GlossaryPanel';
import { StudyList } from './StudyList';

interface GlossViewProps {
  tokens: GlossToken[];
  onToggleFlag: (index: number) => void;
}

// Punctuation that should NOT have a space before it (attaches to the left)
const NO_SPACE_BEFORE = new Set([
  '.', ',', '!', '?', ';', ':', ')', ']', '}', '”', '’', '%', '…'
]);

// Punctuation that should NOT have a space after it (attaches to the right)
const NO_SPACE_AFTER = new Set([
  '(', '[', '{', '“', '‘', '#', '$', '¿', '¡'
]);

export const GlossView: React.FC<GlossViewProps> = ({ tokens, onToggleFlag }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Derive flagged indices from the tokens prop so StudyList can display them
  const flaggedIndices = new Set(
    tokens
      .map((token, idx) => token.isFlagged ? idx : -1)
      .filter(idx => idx !== -1)
  );

  // Pre-calculate straight quote states (open vs close)
  const quoteStateMap = new Map<number, 'open' | 'close'>();
  let quoteOpen = false;
  tokens.forEach((token, idx) => {
    if (token.original === '"') {
      if (quoteOpen) {
        quoteStateMap.set(idx, 'close');
        quoteOpen = false;
      } else {
        quoteStateMap.set(idx, 'open');
        quoteOpen = true;
      }
    }
  });

  const isLeftAttaching = (token: GlossToken, index: number) => {
    if (!token) return false;
    if (NO_SPACE_BEFORE.has(token.original)) return true;
    if (token.original === '"' && quoteStateMap.get(index) === 'close') return true;
    return false;
  };

  const isRightAttaching = (token: GlossToken, index: number) => {
    if (!token) return false;
    if (NO_SPACE_AFTER.has(token.original)) return true;
    if (token.original === '"' && quoteStateMap.get(index) === 'open') return true;
    return false;
  };

  // Helper to determine if a token has padding (is a Word)
  const hasPadding = (token: GlossToken) => !token.isPunctuation;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-700">
      
      {/* Left: Study List */}
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
            <p className="flex flex-wrap items-baseline content-start">
              {tokens.map((token, index) => {
                const isNewline = token.original === '\n' || token.original === '\\n';
                if (isNewline) {
                    return <span key={index} className="w-full h-4 block basis-full"></span>;
                }

                const isActive = activeIndex === index;
                const isFlagged = !!token.isFlagged;
                const isPunc = token.isPunctuation;
                
                // Spacing Logic
                const nextToken = tokens[index + 1];
                const attachToNext = 
                  (isRightAttaching(token, index)) || 
                  (nextToken && isLeftAttaching(nextToken, index + 1));

                let marginClass = 'mr-1.5'; // Default space (0.375rem)

                if (attachToNext) {
                  // If we are attaching, we need to remove the gap.
                  // We also need to compensate for padding if one or both elements have it.
                  // Words have `px-1` (0.25rem = 4px). Punctuation has 0.
                  
                  const currentHasPad = hasPadding(token);
                  const nextHasPad = nextToken && hasPadding(nextToken);

                  if (currentHasPad && nextHasPad) {
                    marginClass = '-mr-2'; // -0.5rem (Swallow 4px right + 4px left)
                  } else if (currentHasPad || nextHasPad) {
                    marginClass = '-mr-1'; // -0.25rem (Swallow 4px)
                  } else {
                    marginClass = 'mr-0';  // No padding involved, just touch
                  }
                }

                // Render Punctuation (Non-interactive)
                if (isPunc) {
                  return (
                    <span 
                      key={index}
                      className={`
                        inline-block relative text-parchment-800
                        ${marginClass}
                      `}
                    >
                      {token.original}
                    </span>
                  );
                }

                // Render Word (Interactive)
                return (
                  <span
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`
                      inline-block relative cursor-pointer transition-all duration-200 rounded px-1
                      ${marginClass}
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
          isFlagged={activeIndex !== null ? !!tokens[activeIndex]?.isFlagged : false}
          onToggleFlag={() => activeIndex !== null && onToggleFlag(activeIndex)}
        />
      </div>
      
    </div>
  );
};