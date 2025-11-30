import React, { useRef } from 'react';
import { ScrollText, Download, FilePlus } from 'lucide-react';
import { GlossToken } from '../types';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  onExport?: () => void;
  onAppend?: (tokens: GlossToken[]) => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset, onExport, onAppend }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAppend) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          // Basic validation to ensure it looks like GlossToken[]
          const isValid = json.length === 0 || (json[0].original !== undefined && json[0].lemma !== undefined);
          if (isValid) {
            onAppend(json as GlossToken[]);
          } else {
            alert("Invalid file format: The JSON does not contain recognized gloss data.");
          }
        } else {
          alert("Invalid file format: Expected an array of tokens.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Failed to parse the file. Please ensure it is a valid JSON file.");
      }
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

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
          {onAppend && (
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                hidden 
              />
              <button 
                onClick={handleFileClick}
                className="flex items-center gap-2 text-sm font-semibold text-parchment-800 hover:text-parchment-600 transition-all border border-parchment-300 hover:border-parchment-500 rounded px-3 py-1.5 bg-parchment-100 hover:bg-white shadow-sm"
                title="Append another analysis JSON to the current text"
              >
                <FilePlus size={16} />
                Append JSON
              </button>
            </div>
          )}

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