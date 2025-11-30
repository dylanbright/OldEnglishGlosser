import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { GlossView } from './components/GlossView';
import { analyzeOldEnglishText } from './services/geminiService';
import { AppState, GlossToken } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [glossTokens, setGlossTokens] = useState<GlossToken[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setAppState(AppState.LOADING);
    setErrorMsg(null);
    try {
      const tokens = await analyzeOldEnglishText(text);
      setGlossTokens(tokens);
      setAppState(AppState.GLOSSING);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze text. Please try again or check your API configuration.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setGlossTokens([]);
    setErrorMsg(null);
  };

  const handleImport = (tokens: GlossToken[]) => {
    setGlossTokens(tokens);
    setAppState(AppState.GLOSSING);
    setErrorMsg(null);
  };

  const handleAppend = (newTokens: GlossToken[]) => {
    setGlossTokens(prevTokens => {
      // Check if we need a separator (newline) between the old and new text
      // to prevent them from running into each other on the same line.
      const lastToken = prevTokens[prevTokens.length - 1];
      const needsSeparator = lastToken && lastToken.original !== '\n' && lastToken.original !== '\\n';

      if (needsSeparator) {
        const separator: GlossToken = {
          original: '\n',
          modernTranslation: 'Line Break',
          lemma: 'N/A',
          partOfSpeech: 'Formatting',
          grammaticalInfo: 'N/A',
          etymology: 'N/A',
          isPunctuation: true,
          isFlagged: false
        };
        // Add two newlines for a paragraph break effect
        return [...prevTokens, separator, separator, ...newTokens];
      }

      return [...prevTokens, ...newTokens];
    });
  };

  const handleToggleFlag = (index: number) => {
    setGlossTokens(prevTokens => {
      const newTokens = [...prevTokens];
      if (newTokens[index]) {
        newTokens[index] = { 
          ...newTokens[index], 
          isFlagged: !newTokens[index].isFlagged 
        };
      }
      return newTokens;
    });
  };

  const handleExport = () => {
    if (glossTokens.length === 0) return;
    
    const dataStr = JSON.stringify(glossTokens, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hwæt_analysis_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-parchment-50 flex flex-col font-sans">
      <Header 
        onReset={handleReset} 
        showReset={appState === AppState.GLOSSING || appState === AppState.ERROR} 
        onExport={appState === AppState.GLOSSING ? handleExport : undefined}
        onAppend={appState === AppState.GLOSSING ? handleAppend : undefined}
      />

      <main className="flex-1 relative">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

        {appState === AppState.INPUT && (
          <InputSection 
            onSubmit={handleAnalyze} 
            onImport={handleImport}
            isLoading={false} 
          />
        )}

        {appState === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center h-full pt-32 animate-in fade-in duration-500">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-parchment-300 border-t-parchment-800 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-serif font-bold text-parchment-800">ð</span>
                </div>
             </div>
             <h3 className="mt-8 text-xl font-serif text-parchment-800">Consulting the Scribes...</h3>
             <p className="text-parchment-600 mt-2 text-sm">This analysis is AI generated.  A serious person would consult an expert, or least a real grammar book.</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-md mx-auto mt-24 p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col items-center text-center animate-in zoom-in-95">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">Translation Error</h3>
            <p className="text-red-600 mb-6">{errorMsg}</p>
            <button 
              onClick={() => setAppState(AppState.INPUT)}
              className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === AppState.GLOSSING && (
          <GlossView 
            tokens={glossTokens} 
            onToggleFlag={handleToggleFlag}
          />
        )}
      </main>
    </div>
  );
};

export default App;