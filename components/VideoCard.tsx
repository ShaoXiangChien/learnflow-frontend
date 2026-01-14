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
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-black relative">
      {/* Video Player Container */}
      <div className="flex-1 relative overflow-hidden">
        <VideoPlayer
          video={video}
          onTimeUpdate={setCurrentTime}
          onEnded={() => {}}
        />

        {/* Interactive Subtitles - Overlaid on video */}
        {isActive && (
          <InteractiveSubtitles
            subtitles={video.subtitles}
            currentTime={currentTime}
            onWordClick={setSelectedWord}
          />
        )}
      </div>

      {/* Bottom Info Bar - Like IG Reels */}
      <div className="bg-black border-t-4 border-[#ccff00] p-4 space-y-3">
        {/* Title and quick info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black uppercase truncate text-white">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-xs font-bold text-gray-300 mt-1 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-shrink-0 border-2 border-[#ccff00] bg-black text-[#ccff00] px-3 py-2 font-black text-xs uppercase hover:bg-[#ccff00] hover:text-black transition-all"
          >
            {showDetails ? '✕' : 'ℹ'}
          </button>
        </div>

        {/* Language and level badges */}
        <div className="flex gap-2 flex-wrap">
          <span className="bg-black text-[#ccff00] text-xs px-3 py-1 font-black uppercase border-2 border-[#ccff00]">
            {video.language.toUpperCase()}
          </span>
          <span className="bg-black text-[#ff00ff] text-xs px-3 py-1 font-black uppercase border-2 border-[#ff00ff]">
            Level: {video.difficulty}
          </span>
          <span className="bg-black text-[#00ffff] text-xs px-3 py-1 font-black uppercase border-2 border-[#00ffff]">
            {video.duration}s
          </span>
        </div>
      </div>

      {/* Details Modal - Half-screen or Popup */}
      {showDetails && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
          {/* Close button */}
          <div className="flex items-center justify-between p-4 border-b-4 border-[#ccff00]">
            <h3 className="text-2xl font-black uppercase text-[#ccff00]">Details</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-3xl font-black text-[#ccff00] hover:text-[#ff00ff] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Full description */}
            {video.description && (
              <div className="neo-card border-4 border-black bg-[#ccff00] text-black p-4">
                <h4 className="text-sm font-black uppercase mb-2">Description</h4>
                <p className="text-sm font-bold leading-relaxed">{video.description}</p>
              </div>
            )}

            {/* Full transcript */}
            <div className="neo-card border-4 border-black bg-[#00ffff] text-black p-4">
              <h4 className="text-sm font-black uppercase mb-3">Full Transcript</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {video.subtitles.map((subtitle, idx) => (
                  <div key={idx} className="text-xs font-bold border-b border-black pb-2">
                    <p className="text-black font-black">{subtitle.text_target}</p>
                    <p className="text-gray-700 text-xs">{subtitle.text_native}</p>
                  </div>
                ))}
              </div>
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
