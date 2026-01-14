'use client';

import { useRef, useEffect, useState } from 'react';
import { Video } from '@/types';

interface VideoPlayerProps {
  video: Video;
  onTimeUpdate: (currentTime: number) => void;
  onEnded: () => void;
}

export default function VideoPlayer({ video, onTimeUpdate, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration);
  const [showPlayButton, setShowPlayButton] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const time = videoElement.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
      onEnded();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onTimeUpdate, onEnded]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only toggle play if clicking on the video itself, not on subtitles or title
    const target = e.target as HTMLElement;
    
    // Check if click is on interactive elements
    if (
      target.closest('[data-interactive]') ||
      target.closest('button') ||
      target.closest('[data-subtitles]')
    ) {
      return;
    }

    togglePlay();
  };

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden cursor-pointer"
      onClick={handleVideoClick}
    >
      {/* Video element - fills entire container */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={video.url}
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      {/* Play button overlay (shown when paused) */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-24 h-24 rounded-full border-4 border-[#ccff00] bg-[#ccff00] flex items-center justify-center hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-all cursor-pointer">
            <span className="text-black font-black text-5xl leading-none ml-1">▶</span>
          </div>
        </div>
      )}

      {/* Simple time display - bottom right corner */}
      {isPlaying && (
        <div className="absolute bottom-4 right-4 z-10 text-[#ccff00] text-xs font-black bg-black/60 px-2 py-1 rounded">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </div>
      )}
    </div>
  );
}
