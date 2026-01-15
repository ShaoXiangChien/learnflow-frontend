'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Word, Video } from '@/types';
import { getVideos } from '@/lib/api';

interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  subtitleTranslation: string;
  words: Word[];
}

const defaultTourData: TourStep = {
  id: 1,
  title: 'Learn Spanish Through Real Videos',
  subtitle: 'Hola, ¿cómo estás? Me llamo Juan.',
  subtitleTranslation: 'Hello, how are you? My name is Juan.',
  words: [
    {
      word: 'Hola',
      translation: 'Hello',
      pronunciation: 'OH-lah',
      definition: 'A greeting used to say hello',
      example: 'Hola, buenos días.',
    },
    {
      word: 'cómo',
      translation: 'how',
      pronunciation: 'KOH-moh',
      definition: 'In what way or manner',
      example: '¿Cómo te llamas?',
    },
    {
      word: 'estás',
      translation: 'are you',
      pronunciation: 'es-TAHS',
      definition: 'Second person singular of estar (to be)',
      example: '¿Cómo estás hoy?',
    },
    {
      word: 'Me',
      translation: 'Me',
      pronunciation: 'meh',
      definition: 'First person singular indirect object pronoun',
      example: 'Me gusta la música.',
    },
    {
      word: 'llamo',
      translation: 'call',
      pronunciation: 'YAH-moh',
      definition: 'First person singular of llamar (to call/to be named)',
      example: 'Me llamo María.',
    },
    {
      word: 'Juan',
      translation: 'John',
      pronunciation: 'HWAN',
      definition: 'A common Spanish male name',
      example: 'Juan es mi amigo.',
    },
  ],
};

type TourState = 'idle' | 'playing' | 'word-selected' | 'flashcard-added' | 'quiz-shown' | 'completed';

export default function InteractiveProductTour() {
  const router = useRouter();
  const [tourState, setTourState] = useState<TourState>('idle');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showWordCard, setShowWordCard] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [tourData, setTourData] = useState<TourStep>(defaultTourData);
  const [loading, setLoading] = useState(true);

  // Load first video data on mount
  useEffect(() => {
    const loadFirstVideo = async () => {
      try {
        const videos = await getVideos();
        if (videos.length > 0) {
          const firstVideo = videos[0];
          // Get first subtitle if available
          if (firstVideo.subtitles && firstVideo.subtitles.length > 0) {
            const firstSubtitle = firstVideo.subtitles[0];
            setTourData({
              id: 1,
              title: firstVideo.title,
              subtitle: firstSubtitle.text_target,
              subtitleTranslation: firstSubtitle.text_native,
              words: firstSubtitle.words || [],
            });
          }
        }
      } catch (error) {
        console.error('Failed to load first video:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFirstVideo();
  }, []);

  // Get instruction text based on tour state
  const getInstruction = () => {
    switch (tourState) {
      case 'idle':
        return '▶️ Click the play button to start watching';
      case 'playing':
        return '👆 Click any word in the subtitle to see its meaning';
      case 'word-selected':
        return '⭐ Click "Add to Flashcards" to save this word';
      case 'flashcard-added':
        return '📚 Check out your flashcard collection, then close it';
      case 'quiz-shown':
        return '🎯 Answer the quiz question to test your knowledge';
      case 'completed':
        return '🎉 You\'ve completed the tour! Ready for the full experience?';
      default:
        return '';
    }
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setTourState('playing');
  };

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
    setShowWordCard(true);
    setTourState('word-selected');
    setHighlightedButton('add-flashcard');
  };

  const handleAddToFlashcards = () => {
    setShowWordCard(false);
    setTourState('flashcard-added');
    setShowFlashcards(true);
    setHighlightedButton(null);
  };

  const handleCloseFlashcards = () => {
    setShowFlashcards(false);
    setShowQuiz(true);
    setTourState('quiz-shown');
  };

  const handleQuizAnswer = () => {
    setQuizAnswered(true);
    setTourState('completed');
  };

  const renderClickableSubtitle = (text: string, words: Word[]) => {
    const textWords = text.split(/\s+/);

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {textWords.map((textWord, index) => {
          const cleanWord = textWord.replace(/[.,!?;:?]/g, '').toLowerCase();
          const wordObj = words.find(
            (w) => w.word.toLowerCase() === cleanWord
          );

          if (wordObj) {
            return (
              <button
                key={index}
                onClick={() => handleWordClick(wordObj)}
                className="border-2 border-[#ccff00] bg-[#ccff00] text-black px-2 py-1 font-black uppercase hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-all cursor-pointer text-xs sm:text-sm"
              >
                {textWord}
              </button>
            );
          }

          return (
            <span key={index} className="text-white px-1 font-bold text-xs sm:text-sm">
              {textWord}
            </span>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-black border-4 border-[#ccff00] p-4 animate-pulse">
          <p className="font-black uppercase text-[#ccff00]">Loading demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instruction Box */}
      <div className="bg-black border-4 border-[#ff00ff] p-4">
        <p className="font-black uppercase text-[#ff00ff] text-sm sm:text-base">
          {getInstruction()}
        </p>
      </div>

      {/* Main Video Card Container */}
      <div className="border-4 border-[#ccff00] bg-black p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-black uppercase text-white">{tourData.title}</h3>

        {/* Video Preview Area */}
        <div className="relative bg-gray-900 border-4 border-[#00ffff] aspect-video flex items-center justify-center overflow-hidden rounded-sm">
          {/* Placeholder for video */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400 font-bold">Video Preview</p>
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlayClick}
            className={`absolute z-20 w-20 h-20 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-black text-3xl transition-all ${
              isPlaying ? 'scale-0 opacity-0' : 'hover:scale-110 hover:bg-[#ff00ff]'
            }`}
          >
            ▶
          </button>

          {/* Subtitle Overlay */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 z-10">
              <div className="space-y-2">
                {/* Target language (clickable) */}
                <div className="text-sm font-black tracking-tight">
                  {renderClickableSubtitle(tourData.subtitle, tourData.words)}
                </div>

                {/* Native language (translation) */}
                <div className="text-xs font-bold text-[#00ffff] text-center">
                  {tourData.subtitleTranslation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Word Details Card with Spotlight Animation */}
        {showWordCard && selectedWord && (
          <div className="relative">
            {/* Spotlight Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ccff00] via-[#ff00ff] to-[#00ffff] rounded-sm opacity-75 blur animate-pulse" />

            {/* Card Content */}
            <div className="bg-black border-4 border-[#00ffff] p-6 space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-2xl font-black uppercase text-[#ccff00]">
                    {selectedWord.word}
                  </h4>
                  <p className="text-sm font-bold text-[#ff00ff] mt-1">
                    {selectedWord.pronunciation}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowWordCard(false);
                    setSelectedWord(null);
                  }}
                  className="text-2xl font-black text-[#00ffff] hover:text-[#ff00ff] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-black uppercase text-[#00ffff] mb-1">Translation:</p>
                  <p className="font-bold text-gray-300">{selectedWord.translation}</p>
                </div>

                <div>
                  <p className="font-black uppercase text-[#00ffff] mb-1">Definition:</p>
                  <p className="font-bold text-gray-300">{selectedWord.definition}</p>
                </div>

                <div>
                  <p className="font-black uppercase text-[#00ffff] mb-1">Example:</p>
                  <p className="font-bold text-gray-300 italic">{selectedWord.example}</p>
                </div>
              </div>

              {/* Add to Flashcards Button with Animation */}
              <button
                onClick={handleAddToFlashcards}
                className={`w-full border-4 border-[#ccff00] bg-[#ccff00] text-black py-3 px-4 font-black uppercase transition-all ${
                  highlightedButton === 'add-flashcard'
                    ? 'animate-pulse scale-105 shadow-lg shadow-[#ccff00]'
                    : 'hover:bg-black hover:text-[#ccff00]'
                }`}
              >
                ⭐ Add to Flashcards
              </button>
            </div>
          </div>
        )}

        {/* Flashcard Collection Preview */}
        {showFlashcards && (
          <div className="relative">
            {/* Spotlight Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ccff00] rounded-sm opacity-75 blur animate-pulse" />

            {/* Card Content */}
            <div className="bg-black border-4 border-[#ff00ff] p-6 space-y-4 relative">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-black uppercase text-[#ff00ff]">
                  📚 Your Flashcards
                </h4>
                <button
                  onClick={handleCloseFlashcards}
                  className="text-2xl font-black text-[#00ffff] hover:text-[#ff00ff] transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Sample Flashcard */}
              <div className="border-4 border-[#00ffff] bg-black p-4 space-y-2">
                <p className="text-lg font-black uppercase text-[#ccff00]">Hola</p>
                <p className="text-sm font-bold text-gray-300">Hello</p>
                <p className="text-xs font-bold text-[#00ffff]">OH-lah</p>
              </div>

              <p className="text-sm font-bold text-gray-400 text-center">
                Close this to continue →
              </p>
            </div>
          </div>
        )}

        {/* Quiz Preview */}
        {showQuiz && !quizAnswered && (
          <div className="relative">
            {/* Spotlight Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffff] via-[#ccff00] to-[#ff00ff] rounded-sm opacity-75 blur animate-pulse" />

            {/* Card Content */}
            <div className="bg-black border-4 border-[#00ffff] p-6 space-y-4 relative">
              <h4 className="text-xl font-black uppercase text-[#00ffff]">
                🎯 Quick Quiz
              </h4>

              <p className="font-bold text-gray-300">
                What does "Hola" mean?
              </p>

              <div className="space-y-2">
                {[
                  { text: 'Hello', correct: true },
                  { text: 'Goodbye', correct: false },
                  { text: 'Thank you', correct: false },
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={handleQuizAnswer}
                    className={`w-full border-4 py-2 px-4 font-black uppercase transition-all ${
                      option.correct
                        ? 'border-[#ccff00] bg-black text-[#ccff00] hover:bg-[#ccff00] hover:text-black'
                        : 'border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {quizAnswered && (
          <div className="bg-black border-4 border-[#ccff00] p-6 text-center space-y-4">
            <p className="text-2xl font-black uppercase text-[#ccff00]">
              🎉 Amazing!
            </p>
            <p className="font-bold text-gray-300">
              You've experienced the core features of LearnFlow. Ready to explore more?
            </p>
            <button
              onClick={() => router.push('/demo')}
              className="w-full bg-[#ccff00] text-black border-4 border-[#ccff00] px-8 py-4 font-black uppercase text-lg hover:bg-black hover:text-[#ccff00] transition-all cursor-pointer"
            >
              Try Full Demo →
            </button>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2 justify-center">
        {[
          { state: 'idle', label: 'Watch' },
          { state: 'playing', label: 'Click' },
          { state: 'word-selected', label: 'Learn' },
          { state: 'flashcard-added', label: 'Cards' },
          { state: 'quiz-shown', label: 'Quiz' },
          { state: 'completed', label: 'Done' },
        ].map((step) => {
          const isActive = tourState === step.state;
          const isCompleted =
            ['idle', 'playing', 'word-selected', 'flashcard-added', 'quiz-shown', 'completed'].indexOf(
              tourState
            ) >=
            ['idle', 'playing', 'word-selected', 'flashcard-added', 'quiz-shown', 'completed'].indexOf(
              step.state
            );

          return (
            <div
              key={step.state}
              className={`flex flex-col items-center gap-1 ${isActive ? 'scale-110' : ''}`}
            >
              <div
                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  isActive
                    ? 'bg-[#ccff00] border-[#ccff00] text-black'
                    : isCompleted
                    ? 'bg-[#ff00ff] border-[#ff00ff] text-white'
                    : 'bg-black border-[#ccff00] text-[#ccff00]'
                }`}
              >
                {isCompleted && !isActive ? '✓' : step.label.charAt(0)}
              </div>
              <span className="text-xs font-bold text-gray-400">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
