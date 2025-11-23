import React from 'react';
import { GlossToken } from '../types';
import { BookMarked, ExternalLink, Library, Bookmark } from 'lucide-react';

interface GlossaryPanelProps {
  token: GlossToken | null;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
}

export const GlossaryPanel: React.FC<GlossaryPanelProps> = ({ token, isFlagged = false, onToggleFlag }) => {
  if (!token) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-parchment-500 p-8 text-center border-l border-parchment-300/50 bg-parchment-100/50">
        <div className="bg-parchment-200 p-4 rounded-full mb-4">
          <BookMarked size={32} className="text-parchment-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-parchment-700">Glossary Empty</h3>
        <p className="text-sm max-w-[200px]">Click a word in the text to reveal its philological secrets.</p>
      </div>
    );
  }

  if (token.isPunctuation) {
     return (
      <div className="h-full flex flex-col items-center justify-center text-parchment-500 p-8 text-center border-l border-parchment-300/50 bg-parchment-100/50">
        <div className="bg-parchment-200 p-4 rounded-full mb-4">
          <span className="text-4xl font-serif text-parchment-800">{token.original}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-parchment-700">Punctuation</h3>
        <p className="text-sm">Syntactic separator.</p>
      </div>
    );
  }

  // Bosworth-Toller search URL
  const bosworthTollerUrl = `https://bosworthtoller.com/search?q=${encodeURIComponent(token.lemma)}`;
  
  // Wiktionary URL with #Old_English anchor to ensure we land on the correct language section
  const wiktionaryUrl = `https://en.wiktionary.org/wiki/${encodeURIComponent(token.lemma)}#Old_English`;

  return (
    <div className="h-full overflow-y-auto border-l border-parchment-300 bg-parchment-50 shadow-inner relative">
      <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300 pb-20">
        
        {/* Flag for Study Toggle */}
        <div className="flex items-center justify-end">
             <label className={`
                flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full border transition-all select-none
                ${isFlagged 
                    ? 'bg-red-50 border-red-200 text-red-900' 
                    : 'bg-parchment-100 border-parchment-200 text-parchment-600 hover:bg-white'}
             `}>
                <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isFlagged}
                    onChange={onToggleFlag}
                />
                <Bookmark size={16} className={isFlagged ? "fill-red-800" : ""} />
                <span className="text-xs font-bold tracking-wide uppercase">
                    {isFlagged ? 'Flagged for Study' : 'Flag for Study'}
                </span>
             </label>
        </div>

        {/* Header Section */}
        <div className="border-b-2 border-parchment-200 pb-6 -mt-2">
            <span className="inline-block px-2 py-1 mb-2 text-xs font-bold tracking-wider text-parchment-600 uppercase bg-parchment-200 rounded">
                {token.partOfSpeech}
            </span>
            <h2 className="text-5xl font-serif font-bold text-parchment-900 mb-2">{token.original}</h2>
            <div className="flex items-baseline gap-2 text-parchment-600 font-serif italic text-xl">
                <span>from</span>
                <span className="font-semibold text-parchment-800 not-italic">"{token.lemma}"</span>
            </div>
        </div>

        {/* Meaning Section */}
        <div>
            <h4 className="text-xs font-bold text-parchment-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-parchment-400"></span>
                Modern Meaning
            </h4>
            <p className="text-2xl font-serif text-parchment-900 leading-relaxed">
                {token.modernTranslation}
            </p>
        </div>

        {/* Grammar Section */}
        <div className="bg-parchment-100 rounded-xl p-6 border border-parchment-200">
            <h4 className="text-xs font-bold text-parchment-500 uppercase tracking-widest mb-4">
                Grammatical Analysis
            </h4>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-parchment-500 mb-1">Morphology</span>
                    <span className="font-medium text-parchment-800 text-lg">{token.grammaticalInfo}</span>
                </div>
            </div>
        </div>

         {/* Etymology Section */}
        {token.etymology && (
            <div>
                <h4 className="text-xs font-bold text-parchment-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-parchment-400"></span>
                    Notes & Etymology
                </h4>
                <p className="text-sm text-parchment-700 leading-relaxed italic">
                    {token.etymology}
                </p>
            </div>
        )}

        {/* External Links Section */}
        <div className="mt-8 pt-6 border-t border-parchment-200">
          <h4 className="text-xs font-bold text-parchment-500 uppercase tracking-widest mb-4">
            External Resources
          </h4>
          <div className="flex flex-col gap-3">
            <a 
              href={bosworthTollerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-parchment-100 hover:bg-white border border-parchment-200 hover:border-parchment-400 transition-all group"
            >
               <div className="flex items-center gap-3">
                 <div className="bg-parchment-200 p-1.5 rounded-md group-hover:bg-parchment-300 transition-colors">
                   <Library size={18} className="text-parchment-700"/>
                 </div>
                 <div className="flex flex-col">
                   <span className="font-serif font-semibold text-parchment-900 leading-tight">Bosworth-Toller</span>
                   <span className="text-[10px] text-parchment-600 uppercase tracking-wider">Anglo-Saxon Dictionary</span>
                 </div>
               </div>
               <ExternalLink size={14} className="text-parchment-400 group-hover:text-parchment-600"/>
            </a>
            
            <a 
              href={wiktionaryUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-parchment-100 hover:bg-white border border-parchment-200 hover:border-parchment-400 transition-all group"
            >
               <div className="flex items-center gap-3">
                 <div className="bg-parchment-200 p-1.5 rounded-md group-hover:bg-parchment-300 transition-colors">
                   <BookMarked size={18} className="text-parchment-700"/>
                 </div>
                 <div className="flex flex-col">
                   <span className="font-serif font-semibold text-parchment-900 leading-tight">Wiktionary</span>
                   <span className="text-[10px] text-parchment-600 uppercase tracking-wider">Free Dictionary</span>
                 </div>
               </div>
               <ExternalLink size={14} className="text-parchment-400 group-hover:text-parchment-600"/>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};