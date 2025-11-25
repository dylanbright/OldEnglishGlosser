import React from 'react';
import { ScrollText, Download } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset, onExport }) => {
  return (
    <header className="bg-parchment-200 border-b border-parchment-300 py-4 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={showReset ? onReset : undefined}>
          <div className="bg-parchment-800 p-2 rounded-lg text-parchment-50">
            <ScrollText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-parchment-900 tracking-tight leading-none">
              Hwæt! Glosser
            </h1>
            <p className="text-xs text-parchment-700 font-medium tracking-wider uppercase opacity-80">
              Old English Philology Tool
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {onExport && (
            <button 
              onClick={onExport}
              className="flex items-center gap-2 text-sm font-semibold text-parchment-800 hover:text-parchment-600 transition-all border border-parchment-300 hover:border-parchment-500 rounded px-3 py-1.5 bg-parchment-100 hover:bg-white shadow-sm"
              title="Save current analysis as JSON"
            >
              <Download size={16} />
              Save Analysis
            </button>
          )}

          {showReset && (
            <button 
              onClick={onReset}
              className="text-sm font-semibold text-parchment-800 hover:text-parchment-600 hover:underline transition-all"
            >
              Analyze New Text
            </button>
          )}
        </div>
      </div>
    </header>
  );
};