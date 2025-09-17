import React from 'react';
import { AnalysisResult, KanjiDetail } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const RadicalChip: React.FC<{ character: string | null; meaning: string }> = ({ character, meaning }) => (
  <div className="flex items-center gap-2 bg-[#ECE9D8] rounded-sm px-2 py-0.5 text-m border border-r-black border-b-black border-l-white border-t-white">
    <span className="font-bold text-blue-700">{character || '🖼️'}</span>
    <span className="text-black">{meaning}</span>
  </div>
);

const KanjiCard: React.FC<{ detail: KanjiDetail }> = ({ detail }) => (
  <fieldset className="border border-gray-400 p-2 text-m w-full">
    <legend className="px-1 text-m">Kanji: {detail.character}</legend>
    <div className="flex items-center gap-4 mb-3">
      <div className="flex-shrink-0 bg-blue-600 text-white w-12 h-12 flex items-center justify-center border-2 border-blue-800">
        <span className="text-3xl">{detail.character}</span>
      </div>
      <div>
        <h3 className="font-bold text-black">Meaning</h3>
        <p className="text-black capitalize">{detail.meaning}</p>
      </div>
    </div>

    {detail.radicals.length > 0 && (
       <div>
        <h4 className="font-semibold text-black mb-2 text-m">Component Radicals:</h4>
        <div className="flex flex-wrap gap-2">
          {detail.radicals.map(radical => (
            <RadicalChip key={radical.id} character={radical.character} meaning={radical.meaning} />
          ))}
        </div>
      </div>
    )}
  </fieldset>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-4 animate-fade-in text-m">
      <fieldset className="border border-gray-400 p-3">
        <legend className="px-1 text-m">Translation</legend>
        <div className="flex items-baseline gap-4">
            <p className="text-xl font-bold">{result.originalWord}</p>
            <span className="text-gray-500 font-bold">&rarr;</span>
            <p className="text-xl font-bold text-blue-700">{result.translation}</p>
        </div>
      </fieldset>

      {result.kanjiDetails.length > 0 && (
        <fieldset className="border border-gray-400 p-3">
            <legend className="px-1 text-m">Kanji Breakdown</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.kanjiDetails.map(detail => (
                <KanjiCard key={detail.id} detail={detail} />
            ))}
            </div>
        </fieldset>
      )}
    </div>
  );
};

export default ResultsDisplay;