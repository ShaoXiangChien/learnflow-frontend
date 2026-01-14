'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, Word } from '@/types';
import VideoPlayer from './VideoPlayer';
import InteractiveSubtitles from './InteractiveSubtitles';
import VocabularyCard from './VocabularyCard';
import FlashcardCollection from './FlashcardCollection';

interface VideoCardProps {
  video: Video;
  isActive: boolean;
}

export default function VideoCard({ video, isActive }: VideoCardProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`neo-card border-4 border-black bg-black text-white w-full transition-all duration-300 ${
        isActive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        maxHeight: isExpanded ? '90vh' : '600px',
        overflow: isExpanded ? 'auto' : 'hidden',
      }}
    >
      {/* Video Player */}
      <div className="relative">
        <VideoPlayer
          video={video}
          onTimeUpdate={setCurrentTime}
          onEnded={() => {}}
        />
      </div>

      {/* Interactive Subtitles */}
      {isActive && (
        <div className="p-4 border-t-4 border-[#ccff00]">
          <InteractiveSubtitles
            subtitles={video.subtitles}
            currentTime={currentTime}
            onWordClick={setSelectedWord}
          />
        </div>
      )}

      {/* Expand/Collapse Button */}
      <div className="p-4 border-t-4 border-[#ccff00] flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="neo-button border-2 border-[#ccff00] bg-black text-[#ccff00] px-4 py-2 text-sm"
        >
          {isExpanded ? 'COLLAPSE ↑' : 'EXPAND ↓'}
        </button>
        <span className="text-xs font-bold text-gray-400">
          {video.duration}s
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t-4 border-[#ccff00] space-y-4">
          {/* Description */}
          {video.description && (
            <div className="neo-card border-2 border-black bg-[#ccff00] text-black p-4">
              <h3 className="text-sm font-black uppercase mb-2">About</h3>
              <p className="text-sm font-bold">{video.description}</p>
            </div>
          )}

          {/* All Subtitles */}
          <div className="neo-card border-2 border-black bg-[#00ffff] text-black p-4">
            <h3 className="text-sm font-black uppercase mb-3">Full Transcript</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {video.subtitles.map((subtitle, idx) => (
                <div key={idx} className="text-xs font-bold border-b border-black pb-2">
                  <p className="text-black font-black">{subtitle.text_target}</p>
                  <p className="text-gray-700 text-xs">{subtitle.text_native}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary Card Modal */}
      <VocabularyCard word={selectedWord} onClose={() => setSelectedWord(null)} />

      {/* Flashcard Collection */}
      <FlashcardCollection />
    </div>
  );
}
