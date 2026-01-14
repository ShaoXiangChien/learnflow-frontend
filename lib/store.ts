import { create } from 'zustand';
import { FlashcardWord } from '@/types';

interface FlashcardStore {
  flashcards: FlashcardWord[];
  addFlashcard: (word: FlashcardWord) => void;
  removeFlashcard: (word: string) => void;
  clearFlashcards: () => void;
  hasWord: (word: string) => boolean;
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  flashcards: [],

  addFlashcard: (word: FlashcardWord) => {
    const { flashcards } = get();
    // Check if word already exists
    if (!flashcards.find(f => f.word === word.word)) {
      set({ flashcards: [...flashcards, word] });
    }
  },

  removeFlashcard: (word: string) => {
    set(state => ({
      flashcards: state.flashcards.filter(f => f.word !== word)
    }));
  },

  clearFlashcards: () => {
    set({ flashcards: [] });
  },

  hasWord: (word: string) => {
    return get().flashcards.some(f => f.word === word);
  }
}));
