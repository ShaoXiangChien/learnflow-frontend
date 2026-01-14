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
    <div className="absolute bottom-0 left-0 right-0 z-20 w-full bg-gradient-to-t from-black/85 via-black/70 to-transparent p-4">
      <div className="space-y-2">
        {/* Target language (clickable) */}
        <div className="text-sm font-black tracking-tight">
          {renderClickableText(currentSubtitle.text_target, currentSubtitle.words)}
        </div>

        {/* Native language (translation) */}
        <div className="text-xs font-bold text-[#00ffff] text-center">
          {currentSubtitle.text_native}
        </div>
      </div>
    </div>
  );
}
