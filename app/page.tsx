import Link from 'next/link';
import { getVideos } from '@/lib/api';

export default async function Home() {
  const videos = await getVideos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white">
            LearnFlow
          </h1>
          <p className="text-white/80 mt-2">
            Learn languages through viral videos
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">
          Featured Videos
        </h2>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all hover:scale-105 hover:shadow-2xl">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-20 h-20 text-white/50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-8 h-8 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {video.language.toUpperCase()}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      Level: {video.difficulty}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {video.duration}s
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/70 text-xl">No videos available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
