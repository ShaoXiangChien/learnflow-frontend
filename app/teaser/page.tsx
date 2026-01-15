'use client';

import { useState } from 'react';
import Link from 'next/link';
import VideoFeed from '@/components/VideoFeed';
import InteractiveProductTour from '@/components/InteractiveProductTour';

export default function TeaserPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Send email to backend/waitlist service
      console.log('Subscribed:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setShowWaitlist(false), 2000);
    }
  };

  if (showDemo) {
    return <VideoFeed />;
  }

  // Route for /demo path
  if (typeof window !== 'undefined' && window.location.pathname === '/demo') {
    return <VideoFeed />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b-4 border-[#ccff00] bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/'}
            className="text-2xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-white">LEARN</span>
            <span className="text-[#ccff00]">FLOW</span>
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setShowWaitlist(true)}
              className="border-2 border-[#ccff00] bg-black text-[#ccff00] px-4 py-2 font-black uppercase text-sm hover:bg-[#ccff00] hover:text-black transition-all"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-black uppercase leading-tight">
                  <span className="text-[#ccff00]">Learn Languages</span>
                  <br />
                  <span className="text-white">The Way You</span>
                  <br />
                  <span className="text-[#ff00ff]">Actually Watch</span>
                </h2>
              </div>

              <p className="text-xl font-bold text-gray-300 leading-relaxed">
                Stop doom-scrolling. Start learning. Transform your favorite short-form videos into interactive language lessons with AI-powered translations, vocabulary cards, and adaptive quizzes.
              </p>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowDemo(true)}
                  className="bg-[#ccff00] text-black border-4 border-[#ccff00] px-8 py-4 font-black uppercase text-lg hover:bg-black hover:text-[#ccff00] transition-all"
                >
                  Try Demo
                </button>
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="bg-black text-[#ff00ff] border-4 border-[#ff00ff] px-8 py-4 font-black uppercase text-lg hover:bg-[#ff00ff] hover:text-black transition-all"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Right: Feature showcase */}
            <div className="space-y-4">
              <div className="border-4 border-[#ccff00] bg-black p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🎬</span>
                  <div>
                    <h3 className="font-black uppercase text-[#ccff00]">Interactive Videos</h3>
                    <p className="text-sm font-bold text-gray-300">Click any word in the subtitles to see translations and definitions instantly</p>
                  </div>
                </div>
              </div>

              <div className="border-4 border-[#ff00ff] bg-black p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📚</span>
                  <div>
                    <h3 className="font-black uppercase text-[#ff00ff]">Smart Flashcards</h3>
                    <p className="text-sm font-bold text-gray-300">Build your vocabulary with AI-generated flashcards from real video content</p>
                  </div>
                </div>
              </div>

              <div className="border-4 border-[#00ffff] bg-black p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🧠</span>
                  <div>
                    <h3 className="font-black uppercase text-[#00ffff]">Adaptive Quizzes</h3>
                    <p className="text-sm font-bold text-gray-300">Test your knowledge with AI-generated questions based on video content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Tour */}
      <section className="py-20 px-4 border-t-4 border-[#ccff00]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black uppercase mb-12 text-[#ccff00]">How It Works</h2>
          <InteractiveProductTour />
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 px-4 border-t-4 border-[#ff00ff]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black uppercase mb-12 text-[#ff00ff]">Learn Any Language</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Spanish', 'French', 'Korean', 'Japanese', 'German', 'Italian'].map((lang) => (
              <div
                key={lang}
                className="border-4 border-[#00ffff] bg-black p-6 text-center font-black uppercase text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all cursor-pointer"
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t-4 border-[#00ffff]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase mb-6">
            <span className="text-[#ccff00]">Ready to Transform</span>
            <br />
            <span className="text-white">Your Language Learning?</span>
          </h2>

          <p className="text-lg font-bold text-gray-300 mb-8">
            Join thousands of learners who are already learning languages through their favorite videos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDemo(true)}
              className="bg-[#ccff00] text-black border-4 border-[#ccff00] px-8 py-4 font-black uppercase text-lg hover:bg-black hover:text-[#ccff00] transition-all"
            >
              Try Demo Now
            </button>
            <button
              onClick={() => setShowWaitlist(true)}
              className="bg-black text-[#ff00ff] border-4 border-[#ff00ff] px-8 py-4 font-black uppercase text-lg hover:bg-[#ff00ff] hover:text-black transition-all"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[#ccff00] bg-black/50 py-8 px-4 text-center">
        <p className="font-bold text-gray-400">
          © 2026 LearnFlow. Learning languages through the videos you love.
        </p>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowWaitlist(false)}
        >
          <div
            className="bg-black border-4 border-[#ccff00] p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWaitlist(false)}
              className="absolute top-4 right-4 text-3xl font-black text-[#ccff00] hover:text-[#ff00ff] transition-colors"
            >
              ✕
            </button>

            {subscribed ? (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black uppercase text-[#ccff00]">
                  Welcome to LearnFlow!
                </h3>
                <p className="text-gray-300 font-bold">
                  Check your email for updates. We'll notify you when we launch!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase text-[#ccff00]">
                  Join the Waitlist
                </h3>
                <p className="text-gray-300 font-bold">
                  Be the first to experience the future of language learning.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black border-4 border-[#ccff00] text-white px-4 py-3 font-bold placeholder-gray-500 focus:outline-none focus:border-[#ff00ff]"
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#ccff00] text-black border-4 border-[#ccff00] px-6 py-3 font-black uppercase hover:bg-black hover:text-[#ccff00] transition-all"
                  >
                    Join Waitlist
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center font-bold">
                  We'll never spam you. Unsubscribe anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
