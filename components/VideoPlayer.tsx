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
      onEnded();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoElement.currentTime = pos * duration;
  };

  const resetVideo = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = 0;
    videoElement.pause();
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
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
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
          onClick={togglePlay}
        >
          <div className="border-4 border-[#ccff00] bg-[#ccff00] text-black rounded-full p-6 hover:scale-110 transition-all font-black text-5xl">
            ▶
          </div>
        </div>
      )}

      {/* Custom controls at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
        <div className="flex items-center gap-3">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            className="border-2 border-[#ccff00] bg-[#ccff00] text-black rounded-full p-2 hover:bg-[#ff00ff] hover:border-[#ff00ff] transition-all flex-shrink-0 font-black text-sm"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Progress bar */}
          <div className="flex-1">
            <div
              className="bg-gray-600 border-2 border-[#ccff00] h-2 overflow-hidden cursor-pointer hover:h-3 transition-all"
              onClick={handleSeek}
            >
              <div
                className="bg-[#ccff00] h-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Time display */}
          <div className="text-[#ccff00] text-xs font-black flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Reset button */}
          <button
            onClick={resetVideo}
            className="border-2 border-[#ccff00] text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all flex-shrink-0 font-black text-sm px-2 py-1"
            title="Reset"
          >
            ↻
          </button>
        </div>
      </div>
    </div>
  );
}
