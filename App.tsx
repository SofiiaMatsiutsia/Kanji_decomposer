import React, { useState, useCallback } from 'react';
import { translateWord } from './services/geminiService';
import { getKanjiAndRadicals } from './services/wanikaniService';
import { AnalysisResult } from './types';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

// A simple XP-style window icon
const IconJapanXP = () => (
    <div className="w-5 h-5 bg-white border border-black flex items-center justify-center">
        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
    </div>
);


const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!word.trim()) {
      setError('Please enter a Japanese word.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const kanjiChars: string[] = [...new Set(word.match(/[一-龯]/g) || [])];
      
      const [translation, kanjiDetails] = await Promise.all([
        translateWord(word),
        kanjiChars.length > 0 ? getKanjiAndRadicals(kanjiChars) : Promise.resolve([])
      ]);

      if (!translation) {
        throw new Error("Could not get a translation.");
      }

      setAnalysisResult({
        originalWord: word,
        translation,
        kanjiDetails,
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [word]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#ECE9D8] text-black shadow-2xl rounded-lg border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080]" style={{ boxShadow: 'inset 1px 1px 0px 1px #FFFFFF, 1px 1px 0px 1px #000000' }}>
        
        <header className="flex items-center justify-between p-1 rounded-t-md bg-gradient-to-b from-[#095BD5] to-[#0048B5]">
          <div className="flex items-center gap-2 pl-1">
            <IconJapanXP />
            <h1 className="text-sm font-bold text-white">
              Kanji Decomposer
            </h1>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-[#ECE9D8] border border-r-black border-b-black border-l-white border-t-white flex items-center justify-center font-black text-xs">_</div>
            <div className="w-5 h-5 bg-[#ECE9D8] border border-r-black border-b-black border-l-white border-t-white flex items-center justify-center font-black text-xs ml-1">□</div>
            <div className="w-5 h-5 bg-[#E20000] border border-r-black border-b-black border-l-white border-t-white flex items-center justify-center font-black text-white text-xs ml-1">X</div>
          </div>
        </header>

        <main className="p-4">
          <p className="mb-4 text-sm">
            Enter a Japanese word to get its translation, kanji meanings, and component radicals.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g., 日本語 or 勉強"
              className="flex-grow bg-white border-2 border-r-[#FFFFFF] border-b-[#FFFFFF] border-l-[#808080] border-t-[#808080] px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
              style={{ boxShadow: 'inset 1px 1px 1px #C0C0C0' }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#ECE9D8] text-black text-sm py-1 px-6 border-2 border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black active:border-r-white active:border-b-white disabled:text-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          <div className="mt-6">
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {analysisResult && <ResultsDisplay result={analysisResult} />}
            {!isLoading && !error && !analysisResult && (
               <div className="text-center text-gray-600 p-10 border border-dashed border-gray-400">
                <p>Your analysis results will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;