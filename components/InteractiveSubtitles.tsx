'use client';

import { useState, useEffect } from 'react';
import { Subtitle, Word } from '@/types';

interface InteractiveSubtitlesProps {
  subtitles: Subtitle[];
  currentTime: number;
  onWordClick: (word: Word) => void;
}

export default function InteractiveSubtitles({
  subtitles,
  currentTime,
  onWordClick,
}: InteractiveSubtitlesProps) {
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  useEffect(() => {
    const subtitle = subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
    setCurrentSubtitle(subtitle || null);
  }, [currentTime, subtitles]);

  if (!currentSubtitle) {
    return <div className="h-32" />;
  }

  const renderClickableText = (text: string, words: Word[]) => {
    // Split text into words and map to Word objects
    const textWords = text.split(/\s+/);

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {textWords.map((textWord, index) => {
          // Find matching word object (case-insensitive, remove punctuation)
          const cleanWord = textWord.replace(/[.,!?;:]/, '').toLowerCase();
          const wordObj = words.find(
            (w) => w.word.toLowerCase() === cleanWord
          );

          if (wordObj) {
            return (
              <button
                key={index}
                onClick={() => onWordClick(wordObj)}
                className="text-white hover:text-yellow-300 hover:bg-white/10 px-2 py-1 rounded transition-all cursor-pointer underline decoration-dotted underline-offset-4"
              >
                {textWord}
              </button>
            );
          }

          return (
            <span key={index} className="text-white px-1">
              {textWord}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 min-h-32">
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-lg p-6 border border-white/10">
        {/* Target language (clickable) */}
        <div className="text-2xl font-medium mb-3">
          {renderClickableText(currentSubtitle.text_target, currentSubtitle.words)}
        </div>

        {/* Native language (translation) */}
        <div className="text-lg text-gray-300 text-center">
          {currentSubtitle.text_native}
        </div>
      </div>
    </div>
  );
}
