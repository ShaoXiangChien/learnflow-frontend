'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import InteractiveSubtitles from '@/components/InteractiveSubtitles';
import VocabularyCard from '@/components/VocabularyCard';
import FlashcardCollection from '@/components/FlashcardCollection';
import QuizModal from '@/components/QuizModal';
import { getVideo, generateQuiz } from '@/lib/api';
import { Video, Word, Quiz } from '@/types';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideo(params.id as string);
        setVideo(videoData);
      } catch (error) {
        console.error('Failed to fetch video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id]);

  const handleVideoEnd = async () => {
    if (!video) return;

    setQuizLoading(true);
    try {
      // Generate transcript from subtitles
      const transcript = video.subtitles
        .map((sub) => sub.text_target)
        .join(' ');

      const quizData = await generateQuiz(video.id, transcript, video.language);
      setQuiz(quizData);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">LearnFlow</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Video player */}
        <VideoPlayer
          video={video}
          onTimeUpdate={setCurrentTime}
          onEnded={handleVideoEnd}
        />

        {/* Interactive subtitles */}
        <InteractiveSubtitles
          subtitles={video.subtitles}
          currentTime={currentTime}
          onWordClick={setSelectedWord}
        />

        {/* Description */}
        {video.description && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">
                About this video
              </h3>
              <p className="text-white/80">{video.description}</p>
            </div>
          </div>
        )}
      </main>

      {/* Vocabulary card modal */}
      <VocabularyCard word={selectedWord} onClose={() => setSelectedWord(null)} />

      {/* Flashcard collection */}
      <FlashcardCollection />

      {/* Quiz modal */}
      <QuizModal quiz={quiz} onClose={() => setQuiz(null)} />

      {/* Quiz loading overlay */}
      {quizLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-900">
              Generating your quiz...
            </p>
            <p className="text-gray-600 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}
