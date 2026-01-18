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
        className="fixed bottom-6 right-6 bg-[#ccff00] text-black rounded-full p-4 shadow-lg hover:scale-110 transition-all z-40 border-4 border-[#ccff00] font-black"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          {flashcards.length > 0 && (
            <span className="bg-[#ff00ff] text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
              {flashcards.length}
            </span>
          )}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-black border-4 border-[#ccff00] p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b-4 border-[#ccff00] pb-4">
              <h2 className="text-3xl font-black text-white uppercase">
                My Flashcards <span className="text-[#ccff00]">({flashcards.length})</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#ccff00] hover:text-[#ff00ff] transition-colors font-black text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Flashcard list */}
            {flashcards.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-lg text-[#ccff00] font-black uppercase">No flashcards yet!</p>
                <p className="text-sm text-white/70 mt-2 font-mono">Click on words in the video to add them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flashcards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-black border-2 border-[#00ffff] p-4 hover:border-[#ff00ff] transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <h3 className="text-2xl font-black text-[#ccff00] uppercase">
                            {card.word}
                          </h3>
                          <span className="text-sm text-[#00ffff] font-mono">
                            {card.pronunciation}
                          </span>
                        </div>
                        <p className="text-lg text-white font-bold mb-1">
                          {card.translation}
                        </p>
                        {card.definition && (
                          <p className="text-sm text-white/80 font-mono mb-1">
                            {card.definition}
                          </p>
                        )}
                        {card.example && (
                          <p className="text-sm text-[#ff00ff]/70 italic font-mono">
                            &ldquo;{card.example}&rdquo;
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFlashcard(card.word)}
                        className="ml-4 text-[#ff00ff] hover:text-[#ccff00] transition-colors font-black text-xl"
                        title="Remove flashcard"
                      >
                        ✕
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
