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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Word */}
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">{word.word}</h2>
          <p className="text-xl text-blue-200">{word.pronunciation}</p>
        </div>

        {/* Translation */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-2">
            Translation
          </h3>
          <p className="text-2xl text-white font-medium">{word.translation}</p>
        </div>

        {/* Definition */}
        {word.definition && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-2">
              Definition
            </h3>
            <p className="text-white/90">{word.definition}</p>
          </div>
        )}

        {/* Example */}
        {word.example && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-2">
              Example
            </h3>
            <p className="text-white/90 italic">&ldquo;{word.example}&rdquo;</p>
          </div>
        )}

        {/* Add to Flashcards button */}
        <button
          onClick={handleAddToFlashcards}
          disabled={isInFlashcards}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
            isInFlashcards
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:scale-105'
          }`}
        >
          {isInFlashcards ? '✓ Added to Flashcards' : '+ Add to Flashcards'}
        </button>
      </div>
    </div>
  );
}
