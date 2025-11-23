import React, { useState } from 'react';
import { Feather, BookOpen } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const SAMPLE_TEXT = "Hwæt! Wé Gárdena in géardagum þéodcyninga þrym gefrúnon hú þá æþelingas ellen fremedon.";

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleUseSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-parchment-300 shadow-xl overflow-hidden">
        <div className="bg-parchment-100/80 border-b border-parchment-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-serif font-semibold text-parchment-900 flex items-center gap-2">
            <Feather size={18} className="text-parchment-600" />
            Input Text
          </h2>
          <button 
            onClick={handleUseSample}
            type="button"
            className="text-xs font-medium text-parchment-600 hover:text-parchment-800 bg-parchment-200/50 hover:bg-parchment-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <BookOpen size={14} />
            Use Beowulf Sample
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your Old English text here (e.g., from Beowulf, The Wanderer, etc.)..."
            className="w-full h-48 bg-parchment-50 border-2 border-parchment-200 rounded-lg p-4 font-serif text-xl text-parchment-900 placeholder:text-parchment-400 focus:border-parchment-500 focus:ring-0 focus:outline-none resize-none transition-all"
            spellCheck={false}
          />
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className={`
                px-8 py-3 rounded-lg font-semibold text-white shadow-md flex items-center gap-2
                transition-all duration-300 transform active:scale-95
                ${!text.trim() || isLoading 
                  ? 'bg-parchment-400 cursor-not-allowed opacity-70' 
                  : 'bg-parchment-700 hover:bg-parchment-800 hover:shadow-lg hover:-translate-y-0.5'}
              `}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analysing...
                </>
              ) : (
                <>
                  <span>Gloss Text</span>
                  <Feather size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <p className="text-center mt-6 text-parchment-600 text-sm max-w-lg mx-auto italic">
        "Swa scribende gesceap hweorfað gleomen gumena geond grund fela..."
        <br/>
        <span className="text-parchment-500 not-italic text-xs mt-1 block">(Use this tool to discover the meaning of ancient words.)</span>
      </p>
    </div>
  );
};