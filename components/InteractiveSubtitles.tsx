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
    return null;
  }

  const renderClickableText = (text: string, words: Word[]) => {
    const textWords = text.split(/\s+/);

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {textWords.map((textWord, index) => {
          const cleanWord = textWord.replace(/[.,!?;:]/, '').toLowerCase();
          const wordObj = words.find(
            (w) => w.word.toLowerCase() === cleanWord
          );

          if (wordObj) {
            return (
              <button
                key={index}
                onClick={() => onWordClick(wordObj)}
                className="border-2 border-[#ccff00] bg-[#ccff00] text-black px-3 py-2 font-black uppercase hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-all cursor-pointer text-sm"
              >
                {textWord}
              </button>
            );
          }

          return (
            <span key={index} className="text-white px-1 font-bold text-sm">
              {textWord}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute bottom-24 left-0 right-0 z-20 flex items-center justify-center px-4">
      <div className="neo-card border-4 border-black bg-black/90 p-4 max-w-sm w-full backdrop-blur-sm">
        {/* Target language (clickable) */}
        <div className="text-lg font-black mb-3 tracking-tight">
          {renderClickableText(currentSubtitle.text_target, currentSubtitle.words)}
        </div>

        {/* Native language (translation) */}
        <div className="text-sm font-bold text-[#00ffff] text-center border-t-2 border-[#ccff00] pt-2">
          {currentSubtitle.text_native}
        </div>
      </div>
    </div>
  );
}
