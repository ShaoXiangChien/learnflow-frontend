'use client';

import { Word } from '@/types';
import { useFlashcardStore } from '@/lib/store';

interface VocabularyCardProps {
  word: Word | null;
  onClose: () => void;
}

export default function VocabularyCard({ word, onClose }: VocabularyCardProps) {
  const { addFlashcard, hasWord } = useFlashcardStore();

  if (!word) return null;

  const handleAddToFlashcards = () => {
    addFlashcard({
      ...word,
      timestamp: Date.now(),
    });
  };

  const isInFlashcards = hasWord(word.word);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-black border-4 border-[#ccff00] p-8 max-w-md w-full shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#ccff00] hover:text-[#ff00ff] transition-colors font-black text-2xl"
        >
          ✕
        </button>

        {/* Word */}
        <div className="mb-6 border-b-4 border-[#ccff00] pb-4">
          <h2 className="text-4xl font-black text-white mb-2 uppercase">{word.word}</h2>
          <p className="text-lg text-[#00ffff] font-bold">{word.pronunciation}</p>
        </div>

        {/* Translation */}
        <div className="mb-6">
          <h3 className="text-xs font-black text-[#ff00ff] uppercase tracking-widest mb-2">
            Translation
          </h3>
          <p className="text-2xl text-white font-bold">{word.translation}</p>
        </div>

        {/* Definition */}
        {word.definition && (
          <div className="mb-6">
            <h3 className="text-xs font-black text-[#00ffff] uppercase tracking-widest mb-2">
              Definition
            </h3>
            <p className="text-white font-mono text-sm">{word.definition}</p>
          </div>
        )}

        {/* Example */}
        {word.example && (
          <div className="mb-6 bg-black border-2 border-[#ff00ff] p-3">
            <h3 className="text-xs font-black text-[#ff00ff] uppercase tracking-widest mb-2">
              Example
            </h3>
            <p className="text-white/90 font-mono text-sm italic">&ldquo;{word.example}&rdquo;</p>
          </div>
        )}

        {/* Add to Flashcards button */}
        <button
          onClick={handleAddToFlashcards}
          disabled={isInFlashcards}
          className={`w-full py-3 px-6 font-black uppercase transition-all border-2 ${
            isInFlashcards
              ? 'bg-[#ccff00] text-black border-[#ccff00] cursor-not-allowed'
              : 'bg-black text-[#ccff00] border-[#ccff00] hover:bg-[#ccff00] hover:text-black hover:scale-105'
          }`}
        >
          {isInFlashcards ? '✓ Added' : '+ Add to Flashcards'}
        </button>
      </div>
    </div>
  );
}
