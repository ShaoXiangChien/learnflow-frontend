'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Video } from '@/types';
import { getVideos } from '@/lib/api';
import VideoCard from './VideoCard';
import QuizModal from './QuizModal';
import FlashcardCollection from './FlashcardCollection';

interface VideoWithQuiz extends Video {
  quiz?: any;
}

export default function VideoFeed() {
  const [videos, setVideos] = useState<VideoWithQuiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [videosWatched, setVideosWatched] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Load videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load videos:', error);
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].screenY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const goToNext = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setVideosWatched(videosWatched + 1);

      // Check if we should show quiz (every 3-5 videos, randomly)
      const quizFrequency = Math.floor(Math.random() * 3) + 3; // 3-5
      if ((videosWatched + 1) % quizFrequency === 0) {
        // Load quiz for current video
        loadQuizForVideo(videos[currentIndex + 1].id);
      }
    }
  }, [currentIndex, videos, videosWatched]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const loadQuizForVideo = async (videoId: string) => {
    try {
      // For now, we'll create a mock quiz
      // Later, this will load from backend or local files
      const mockQuiz = {
        video_id: videoId,
        questions: [
          {
            question: 'What was the main topic of this video?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct_answer: 0,
            explanation: 'This is the correct answer because...',
          },
        ],
      };
      setCurrentQuiz(mockQuiz);
      setShowQuiz(true);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">▶</div>
          <div className="text-2xl font-black uppercase text-[#ccff00]">Loading videos...</div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center neo-card border-4 border-black bg-[#ccff00] text-black p-12 max-w-md">
          <div className="text-6xl mb-4">📹</div>
          <div className="text-2xl font-black uppercase mb-2">No videos available</div>
          <p className="text-lg font-bold">Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="flex-shrink-0 border-b-4 border-[#ccff00] bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            <span className="text-white">LEARN</span>
            <span className="text-[#ccff00]">FLOW</span>
          </h1>
          <div className="text-sm font-bold text-[#ccff00] bg-black border-2 border-[#ccff00] px-3 py-1">
            {currentIndex + 1} / {videos.length}
          </div>
        </div>
      </header>

      {/* Video Cards Stack - Flexible container */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        {videos.map((video, index) => {
          const offset = index - currentIndex;
          const isVisible = offset >= 0 && offset < 3;

          if (!isVisible) return null;

          return (
            <div
              key={video.id}
              className={`absolute w-full h-full max-w-md transition-all duration-500 ease-out ${
                offset === 0 ? 'card-enter z-30 scale-100' : 'z-20 scale-95 opacity-50'
              }`}
              style={{
                transform: `translateY(${offset * 20}px) scale(${1 - offset * 0.05})`,
              }}
            >
              <VideoCard video={video} isActive={offset === 0} />
            </div>
          );
        })}
      </div>

      {/* Flashcard Collection - Bottom right corner (visible on all screen sizes) */}
      <FlashcardCollection />

      {/* Quiz Modal */}
      {showQuiz && currentQuiz && (
        <QuizModal
          quiz={currentQuiz}
          onClose={() => {
            setShowQuiz(false);
            setCurrentQuiz(null);
          }}
        />
      )}
    </div>
  );
}
