'use client';

import { useState } from 'react';
import { Word } from '@/types';

interface TourStep {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  subtitleTranslation: string;
  words: Word[];
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: 'Watch',
    description: 'Pick any short-form video in your favorite language',
    subtitle: 'Hola, ¿cómo estás?',
    subtitleTranslation: 'Hello, how are you?',
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
    ],
  },
  {
    id: 2,
    title: 'Click',
    description: 'Tap any word in the subtitles to see translations and definitions',
    subtitle: 'Je suis très heureux',
    subtitleTranslation: 'I am very happy',
    words: [
      {
        word: 'Je',
        translation: 'I',
        pronunciation: 'zhuh',
        definition: 'First person singular pronoun',
        example: 'Je suis français.',
      },
      {
        word: 'suis',
        translation: 'am',
        pronunciation: 'swee',
        definition: 'First person singular of être (to be)',
        example: 'Je suis heureux.',
      },
      {
        word: 'très',
        translation: 'very',
        pronunciation: 'treh',
        definition: 'Adverb meaning to a great degree',
        example: 'C\'est très bon.',
      },
      {
        word: 'heureux',
        translation: 'happy',
        pronunciation: 'uh-RUH',
        definition: 'Adjective meaning happy or fortunate',
        example: 'Je suis très heureux.',
      },
    ],
  },
  {
    id: 3,
    title: 'Learn',
    description: 'Build your vocabulary with AI-generated flashcards from real content',
    subtitle: '我喜欢学习新的语言',
    subtitleTranslation: 'I like learning new languages',
    words: [
      {
        word: '我',
        translation: 'I',
        pronunciation: 'wǒ',
        definition: 'First person singular pronoun',
        example: '我是学生。',
      },
      {
        word: '喜欢',
        translation: 'like',
        pronunciation: 'xǐ huān',
        definition: 'To like or enjoy',
        example: '我喜欢看电影。',
      },
      {
        word: '学习',
        translation: 'learn',
        pronunciation: 'xué xí',
        definition: 'To study or learn',
        example: '我喜欢学习新的语言。',
      },
    ],
  },
  {
    id: 4,
    title: 'Quiz',
    description: 'Test your knowledge with AI-generated questions based on video content',
    subtitle: '¿Cuál es tu nombre?',
    subtitleTranslation: 'What is your name?',
    words: [
      {
        word: 'Cuál',
        translation: 'What',
        pronunciation: 'KWAL',
        definition: 'Interrogative pronoun',
        example: '¿Cuál es tu nombre?',
      },
      {
        word: 'tu',
        translation: 'your',
        pronunciation: 'too',
        definition: 'Possessive adjective',
        example: '¿Cuál es tu nombre?',
      },
      {
        word: 'nombre',
        translation: 'name',
        pronunciation: 'NOM-breh',
        definition: 'A word by which someone or something is known',
        example: 'Mi nombre es Juan.',
      },
    ],
  },
];

export default function ProductTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showWordDetails, setShowWordDetails] = useState(false);

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleWordClick = (word: Word) => {
    setSelectedWord(word);
    setShowWordDetails(true);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowWordDetails(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowWordDetails(false);
    }
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

  return (
    <div className="space-y-8">
      {/* Tour Container */}
      <div className="border-4 border-[#ccff00] bg-black p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-black uppercase text-[#ccff00] mb-3">
            <span>Step {currentStep + 1} of {tourSteps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-black border-2 border-[#ccff00] h-4">
            <div
              className="bg-[#ccff00] h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step Number and Title */}
          <div className="space-y-2">
            <div className="text-6xl font-black text-[#ff00ff]">{step.id}</div>
            <h3 className="text-4xl font-black uppercase text-white">{step.title}</h3>
            <p className="text-lg font-bold text-gray-300">{step.description}</p>
          </div>

          {/* Video Preview Area */}
          <div className="relative bg-gray-900 border-4 border-[#00ffff] aspect-video flex items-center justify-center overflow-hidden">
            {/* Placeholder for video - in real app this would be actual video */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-400 font-bold">Video Preview</p>
              </div>
            </div>

            {/* Subtitle Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 z-10">
              <div className="space-y-2">
                {/* Target language (clickable) */}
                <div className="text-sm font-black tracking-tight">
                  {renderClickableSubtitle(step.subtitle, step.words)}
                </div>

                {/* Native language (translation) */}
                <div className="text-xs font-bold text-[#00ffff] text-center">
                  {step.subtitleTranslation}
                </div>
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="bg-black border-4 border-[#ff00ff] p-4">
            <p className="font-black uppercase text-[#ff00ff] text-sm">
              💡 TIP: Click any word in the subtitle above to see its definition!
            </p>
          </div>

          {/* Word Details Card */}
          {showWordDetails && selectedWord && (
            <div className="bg-black border-4 border-[#00ffff] p-6 space-y-3 animate-in">
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
                  onClick={() => setShowWordDetails(false)}
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
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex-1 border-4 py-3 px-6 font-black uppercase transition-all ${
              currentStep === 0
                ? 'border-gray-600 text-gray-600 bg-black cursor-not-allowed'
                : 'border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === tourSteps.length - 1}
            className={`flex-1 border-4 py-3 px-6 font-black uppercase transition-all ${
              currentStep === tourSteps.length - 1
                ? 'border-gray-600 text-gray-600 bg-black cursor-not-allowed'
                : 'border-[#ccff00] bg-[#ccff00] text-black hover:bg-black hover:text-[#ccff00]'
            }`}
          >
            Next →
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 justify-center mt-6">
          {tourSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentStep(index);
                setShowWordDetails(false);
              }}
              className={`w-3 h-3 border-2 transition-all ${
                index === currentStep
                  ? 'bg-[#ccff00] border-[#ccff00]'
                  : index < currentStep
                  ? 'bg-[#ff00ff] border-[#ff00ff]'
                  : 'bg-black border-[#ccff00]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-300 font-bold mb-4">
          Ready to experience the full power of LearnFlow?
        </p>
        <p className="text-sm text-gray-400 font-bold">
          Click "Try Demo" in the hero section to access the complete app with real videos!
        </p>
      </div>
    </div>
  );
}
