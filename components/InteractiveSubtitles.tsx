'use client';

import { useState, useEffect } from 'react';
import { Subtitle, Word } from '@/types';

interface InteractiveSubtitlesProps {
  subtitles: Subtitle[];
  currentTime: number;
  onWordClick: (word: Word) => void;
  language?: string;
}

export default function InteractiveSubtitles({
  subtitles,
  currentTime,
  onWordClick,
  language = 'en',
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

  // Check if language is CJK (Chinese, Japanese, Korean)
  const isCJK = ['zh', 'ja', 'ko'].includes(language);

  const renderClickableText = (text: string, words: Word[]) => {
    if (isCJK) {
      return renderCJKText(text, words);
    } else {
      return renderSpaceDelimitedText(text, words);
    }
  };

  // For space-delimited languages (English, Spanish, French, etc.)
  const renderSpaceDelimitedText = (text: string, words: Word[]) => {
    const textWords = text.split(/\s+/);

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {textWords.map((textWord, index) => {
          const cleanWord = textWord.replace(/[.,!?;:()]/g, '').toLowerCase();
          const wordObj = words.find(
            (w) => w.word.toLowerCase() === cleanWord
          );

          if (wordObj) {
            return (
              <button
                key={index}
                onClick={() => onWordClick(wordObj)}
                className="border-2 border-[#ccff00] bg-[#ccff00] text-black px-2 py-1 font-black uppercase hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-all cursor-pointer text-xs sm:text-sm"
                data-interactive="true"
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

  // For CJK languages (Chinese, Japanese, Korean)
  const renderCJKText = (text: string, words: Word[]) => {
    // Sort words by length (longest first) to handle overlapping cases
    const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

    let elements: (string | JSX.Element)[] = [];
    let remaining = text;
    let elementKey = 0;

    while (remaining.length > 0) {
      let found = false;

      // Try to match each word from longest to shortest
      for (const wordObj of sortedWords) {
        if (remaining.startsWith(wordObj.word)) {
          // Found a match
          elements.push(
            <button
              key={elementKey++}
              onClick={() => onWordClick(wordObj)}
              className="border-2 border-[#ccff00] bg-[#ccff00] text-black px-1 py-0.5 font-black hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-all cursor-pointer text-xs sm:text-sm inline-block"
              data-interactive="true"
            >
              {wordObj.word}
            </button>
          );
          remaining = remaining.slice(wordObj.word.length);
          found = true;
          break;
        }
      }

      if (!found) {
        // No match found, add the first character as regular text
        const char = remaining[0];
        // Check if it's punctuation or special character
        if (/[.,!?;:()（）、，。！？；：]/.test(char)) {
          elements.push(char);
        } else {
          elements.push(
            <span key={elementKey++} className="text-white font-bold text-xs sm:text-sm">
              {char}
            </span>
          );
        }
        remaining = remaining.slice(1);
      }
    }

    return (
      <div className="flex flex-wrap gap-0.5 justify-center">
        {elements}
      </div>
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 w-full bg-gradient-to-t from-black/85 via-black/70 to-transparent p-4" data-subtitles="true">
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
