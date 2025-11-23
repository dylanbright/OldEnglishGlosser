import React from 'react';
import { GlossToken } from '../types';
import { Bookmark, BookOpen, Download } from 'lucide-react';

interface StudyListProps {
  tokens: GlossToken[];
  flaggedIndices: Set<number>;
  onSelectToken: (index: number) => void;
  activeIndex: number | null;
}

export const StudyList: React.FC<StudyListProps> = ({ 
  tokens, 
  flaggedIndices, 
  onSelectToken,
  activeIndex
}) => {
  const flaggedList = Array.from(flaggedIndices).sort((a, b) => a - b);

  // Helper to reconstruct the sentence surrounding a specific token index
  const getContextSentence = (targetIndex: number): string => {
    if (!tokens || tokens.length === 0) return "";

    // 1. Find start of sentence (backwards until punctuation terminator or start)
    let startIndex = targetIndex;
    while (startIndex > 0) {
      const prevToken = tokens[startIndex - 1];
      if (prevToken.isPunctuation && /[.?!]/.test(prevToken.original)) {
        break;
      }
      startIndex--;
    }

    // 2. Find end of sentence (forwards until punctuation terminator or end)
    let endIndex = targetIndex;
    while (endIndex < tokens.length - 1) {
      const currToken = tokens[endIndex];
      if (currToken.isPunctuation && /[.?!]/.test(currToken.original)) {
        break;
      }
      endIndex++;
    }

    // 3. Construct string with HTML formatting
    let sentenceParts: string[] = [];
    
    for (let i = startIndex; i <= endIndex; i++) {
      const token = tokens[i];
      let text = token.original;
      
      // Bold the target word
      if (i === targetIndex) {
        text = `<b>${text}</b>`;
      }

      // Add simple logic to avoid spaces before punctuation
      // (This is a heuristic since we don't have original whitespace data)
      if (token.isPunctuation) {
         // Attach punctuation to previous word by checking current length of array
         if (sentenceParts.length > 0) {
            const lastPart = sentenceParts[sentenceParts.length - 1];
            // If the last part ended with a space, trim it to attach punctuation
            sentenceParts[sentenceParts.length - 1] = lastPart.trimEnd() + text + " ";
         } else {
             sentenceParts.push(text + " ");
         }
      } else {
         sentenceParts.push(text + " ");
      }
    }

    return sentenceParts.join("").trim();
  };

  const handleExportCSV = () => {
    if (flaggedList.length === 0) return;

    // Headers compatible with Anki import (though Anki doesn't strictly require headers, it helps organization)
    const headers = ["Lemma (Root)", "Context Sentence (Front)", "Definition & Grammar (Back)"];
    
    const rows = flaggedList.map(index => {
      const token = tokens[index];
      const context = getContextSentence(index);
      
      // Construct HTML formatted back-of-card content
      const definitionHtml = `
<p><b>Meaning:</b> ${token.modernTranslation}</p>
<p><b>Grammar:</b> ${token.grammaticalInfo}</p>
<p><i>${token.partOfSpeech}</i></p>
${token.etymology ? `<small>${token.etymology}</small>` : ''}
      `.trim().replace(/\n/g, ""); // Flatten newlines for CSV safety

      return [
        token.lemma,
        context,
        definitionHtml
      ];
    });

    const csvContent = [
      headers, 
      ...rows
    ].map(row => 
      row.map(cell => 
        `"${cell.replace(/"/g, '""')}"` // Escape double quotes
      ).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'old_english_study_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full bg-parchment-200/50 border-r border-parchment-300 flex flex-col w-64 flex-shrink-0">
      <div className="p-4 border-b border-parchment-300 bg-parchment-200">
        <h3 className="font-serif font-bold text-parchment-900 flex items-center gap-2">
          <Bookmark size={18} className="fill-parchment-800 text-parchment-800" />
          Study List
        </h3>
        <p className="text-xs text-parchment-600 mt-1">
          Words marked for review
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {flaggedList.length === 0 ? (
          <div className="text-center p-6 text-parchment-500 italic text-sm">
            <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
            <p>No words flagged yet.</p>
            <p className="text-xs mt-2">Use the checkbox in the glossary to add words here.</p>
          </div>
        ) : (
          flaggedList.map((index) => {
            const token = tokens[index];
            return (
              <button
                key={index}
                onClick={() => onSelectToken(index)}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all group
                  ${activeIndex === index 
                    ? 'bg-white border-parchment-400 shadow-sm' 
                    : 'bg-parchment-100/50 border-transparent hover:bg-parchment-100 hover:border-parchment-300'}
                `}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif font-semibold text-lg text-parchment-900 group-hover:text-red-900 transition-colors">
                    {token.original}
                  </span>
                  <span className="text-[10px] font-bold text-parchment-500 uppercase">
                    {token.partOfSpeech}
                  </span>
                </div>
                <div className="text-sm text-parchment-600 italic">
                  {token.lemma}
                </div>
              </button>
            );
          })
        )}
      </div>
      
      {flaggedList.length > 0 && (
        <div className="p-4 bg-parchment-200 border-t border-parchment-300 flex flex-col gap-3">
            <div className="text-center">
                <span className="text-xs font-semibold text-parchment-600">
                    {flaggedList.length} word{flaggedList.length !== 1 ? 's' : ''} saved
                </span>
            </div>
            <button 
              onClick={handleExportCSV}
              className="w-full flex items-center justify-center gap-2 bg-parchment-800 hover:bg-parchment-900 text-parchment-50 text-sm font-semibold py-2 px-3 rounded shadow transition-all hover:-translate-y-0.5"
            >
              <Download size={16} />
              Export CSV
            </button>
        </div>
      )}
    </div>
  );
};