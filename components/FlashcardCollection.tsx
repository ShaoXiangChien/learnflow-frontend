'use client';

import { useState } from 'react';
import { useFlashcardStore } from '@/lib/store';

export default function FlashcardCollection() {
  const { flashcards, removeFlashcard } = useFlashcardStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-all z-40"
      >
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {flashcards.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {flashcards.length}
            </span>
          )}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                My Flashcards ({flashcards.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Flashcard list */}
            {flashcards.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg">No flashcards yet!</p>
                <p className="text-sm mt-2">Click on words in the video to add them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-purple-900">
                            {card.word}
                          </h3>
                          <span className="text-sm text-purple-600">
                            {card.pronunciation}
                          </span>
                        </div>
                        <p className="text-lg text-gray-700 mb-1">
                          {card.translation}
                        </p>
                        {card.definition && (
                          <p className="text-sm text-gray-600 mb-1">
                            {card.definition}
                          </p>
                        )}
                        {card.example && (
                          <p className="text-sm text-gray-500 italic">
                            &ldquo;{card.example}&rdquo;
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFlashcard(card.word)}
                        className="ml-4 text-red-400 hover:text-red-600 transition-colors"
                        title="Remove flashcard"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
